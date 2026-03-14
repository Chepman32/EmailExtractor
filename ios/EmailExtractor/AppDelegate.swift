import UIKit
import React
import React_RCTAppDelegate
import ReactAppDependencyProvider
import Vision
import PDFKit
import CoreImage
import ImageIO

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  var window: UIWindow?

  var reactNativeDelegate: ReactNativeDelegate?
  var reactNativeFactory: RCTReactNativeFactory?

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    let delegate = ReactNativeDelegate()
    let factory = RCTReactNativeFactory(delegate: delegate)
    delegate.dependencyProvider = RCTAppDependencyProvider()

    reactNativeDelegate = delegate
    reactNativeFactory = factory

    window = UIWindow(frame: UIScreen.main.bounds)

    factory.startReactNative(
      withModuleName: "EmailExtractor",
      in: window,
      launchOptions: launchOptions
    )

    return true
  }
}

class ReactNativeDelegate: RCTDefaultReactNativeFactoryDelegate {
  override func sourceURL(for bridge: RCTBridge) -> URL? {
    self.bundleURL()
  }

  override func bundleURL() -> URL? {
#if DEBUG
    RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
#else
    Bundle.main.url(forResource: "main", withExtension: "jsbundle")
#endif
  }
}

@objc(EmailExtractionModule)
class EmailExtractionModule: NSObject, RCTBridgeModule {
  private let processingQueue = DispatchQueue(label: "EmailExtractionModule.processing", qos: .userInitiated)

  static func moduleName() -> String! {
    "EmailExtractionModule"
  }

  static func requiresMainQueueSetup() -> Bool {
    false
  }

  @objc(extractFromText:resolver:rejecter:)
  func extractFromText(_ input: String,
                       resolver resolve: @escaping RCTPromiseResolveBlock,
                       rejecter reject: @escaping RCTPromiseRejectBlock) {
    processingQueue.async {
      let emails = self.extractEmails(from: input)
      resolve(self.makeResult(emails: emails, source: "text", rawTextLength: input.count, warnings: []))
    }
  }

  @objc(extractFromImage:resolver:rejecter:)
  func extractFromImage(_ fileUri: String,
                        resolver resolve: @escaping RCTPromiseResolveBlock,
                        rejecter reject: @escaping RCTPromiseRejectBlock) {
    processingQueue.async {
      do {
        let result = try self.extractFromImageFile(fileUri)
        resolve(self.makeResult(
          emails: result.emails,
          source: "camera",
          rawTextLength: result.text.count,
          warnings: result.warnings
        ))
      } catch {
        NSLog("[EmailExtraction] extractFromImage failed: %@", error.localizedDescription)
        reject("extract_image_failed", error.localizedDescription, error)
      }
    }
  }

  @objc(extractFromFile:mimeType:resolver:rejecter:)
  func extractFromFile(_ fileUri: String,
                       mimeType: String?,
                       resolver resolve: @escaping RCTPromiseResolveBlock,
                       rejecter reject: @escaping RCTPromiseRejectBlock) {
    processingQueue.async {
      do {
        let url = try self.resolveFileURL(fileUri)
        let extensionName = url.pathExtension.lowercased()
        var warnings: [String] = []
        let sourceText: String

        if extensionName == "pdf" || (mimeType ?? "").contains("pdf") {
          let result = try self.extractTextFromPDF(url)
          sourceText = result.text
          warnings = result.warnings
        } else if ["txt", "text", "csv", "md"].contains(extensionName) || (mimeType ?? "").contains("text") {
          sourceText = try self.extractTextFromTextFile(url)
        } else if ["jpg", "jpeg", "png", "heic", "heif", "webp"].contains(extensionName) || (mimeType ?? "").contains("image") {
          let result = try self.extractFromImageFile(fileUri)
          sourceText = result.text
          warnings.append(contentsOf: result.warnings)
        } else {
          throw NSError(domain: "EmailExtractionModule", code: 1001, userInfo: [NSLocalizedDescriptionKey: "Unsupported file type"])
        }

        let emails = self.extractEmails(from: sourceText)
        resolve(self.makeResult(emails: emails, source: "files", rawTextLength: sourceText.count, warnings: warnings))
      } catch {
        NSLog("[EmailExtraction] extractFromFile failed: %@", error.localizedDescription)
        reject("extract_file_failed", error.localizedDescription, error)
      }
    }
  }

  @objc(exportEmails:format:resolver:rejecter:)
  func exportEmails(_ emails: [String],
                    format: String,
                    resolver resolve: @escaping RCTPromiseResolveBlock,
                    rejecter reject: @escaping RCTPromiseRejectBlock) {
    processingQueue.async {
      do {
        let exportFormat = format.lowercased() == "csv" ? "csv" : "txt"
        let fileName = "emails-\(Int(Date().timeIntervalSince1970)).\(exportFormat)"
        let fileURL = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent(fileName)
        let payload: String

        if exportFormat == "csv" {
          let rows = emails.map { email in "\"\(email.replacingOccurrences(of: "\"", with: "\"\""))\"" }
          payload = (["email"] + rows).joined(separator: "\n")
        } else {
          payload = emails.joined(separator: "\n")
        }

        try payload.write(to: fileURL, atomically: true, encoding: .utf8)
        resolve(["fileUri": fileURL.absoluteString])
      } catch {
        reject("export_failed", "Unable to export emails", error)
      }
    }
  }

  private func makeResult(emails: [String], source: String, rawTextLength: Int, warnings: [String]) -> [String: Any] {
    return [
      "emails": emails,
      "source": source,
      "rawTextLength": rawTextLength,
      "extractedAt": ISO8601DateFormatter().string(from: Date()),
      "warnings": warnings
    ]
  }

  private func resolveFileURL(_ input: String) throws -> URL {
    if let url = URL(string: input), url.isFileURL {
      let path = url.path
      NSLog("[EmailExtraction] resolveFileURL via URL(string:) path=%@", path)
      if FileManager.default.fileExists(atPath: path) {
        return url
      }
    }

    let cleaned = input.replacingOccurrences(of: "file://", with: "").removingPercentEncoding ?? input.replacingOccurrences(of: "file://", with: "")
    NSLog("[EmailExtraction] resolveFileURL fallback cleaned=%@", cleaned)
    let url = URL(fileURLWithPath: cleaned)

    if FileManager.default.fileExists(atPath: url.path) {
      return url
    }

    NSLog("[EmailExtraction] resolveFileURL file not found: %@", url.path)
    throw NSError(domain: "EmailExtractionModule", code: 1002, userInfo: [NSLocalizedDescriptionKey: "File does not exist at path: \(url.path)"])
  }

  private func loadImage(from fileUri: String) throws -> UIImage {
    let url = try resolveFileURL(fileUri)
    NSLog("[EmailExtraction] loadImage path=%@", url.path)

    if let image = UIImage(contentsOfFile: url.path) {
      return image
    }

    NSLog("[EmailExtraction] UIImage(contentsOfFile:) failed, trying Data(contentsOf:)")
    guard let data = try? Data(contentsOf: url),
          let image = UIImage(data: data) else {
      throw NSError(domain: "EmailExtractionModule", code: 1003, userInfo: [NSLocalizedDescriptionKey: "Unable to read image at path: \(url.path)"])
    }

    return image
  }

  private func extractFromImageFile(_ fileUri: String) throws -> (emails: [String], text: String, warnings: [String]) {
    let image = try loadImage(from: fileUri)
    var collectedText: [String] = []
    var warnings: [String] = []

    do {
      let primaryText = try ocrText(from: image)

      if !primaryText.isEmpty {
        collectedText.append(primaryText)
      }
    } catch {
      warnings.append("Primary OCR pass failed")
    }

    var emails = extractEmails(from: collectedText.joined(separator: "\n"))

    if emails.isEmpty, let highContrastImage = makeHighContrastImage(from: image) {
      do {
        let fallbackText = try ocrText(from: highContrastImage)

        if !fallbackText.isEmpty {
          collectedText.append(fallbackText)
        }
      } catch {
        warnings.append("High-contrast OCR fallback failed")
      }

      emails = extractEmails(from: collectedText.joined(separator: "\n"))
    }

    return (emails, collectedText.joined(separator: "\n"), warnings)
  }

  private func ocrText(from image: UIImage) throws -> String {
    let ocrInput = try makeOCRInput(from: image)

    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = false
    request.recognitionLanguages = ["en-US"]

    let handler = VNImageRequestHandler(
      cgImage: ocrInput.cgImage,
      orientation: ocrInput.orientation,
      options: [:]
    )
    try handler.perform([request])

    let observations = request.results ?? []

    return observations
      .flatMap { observation in
        observation.topCandidates(3).map { $0.string }
      }
      .joined(separator: "\n")
  }

  private func makeOCRInput(from image: UIImage) throws -> (cgImage: CGImage, orientation: CGImagePropertyOrientation) {
    if let cgImage = image.cgImage {
      return (cgImage, CGImagePropertyOrientation(image.imageOrientation))
    }

    if let ciImage = image.ciImage {
      let context = CIContext()

      guard let cgImage = context.createCGImage(ciImage, from: ciImage.extent) else {
        throw NSError(domain: "EmailExtractionModule", code: 1004, userInfo: [NSLocalizedDescriptionKey: "Unable to process image"])
      }

      return (cgImage, .up)
    }

    let renderer = UIGraphicsImageRenderer(size: image.size)
    let renderedImage = renderer.image { _ in
      image.draw(in: CGRect(origin: .zero, size: image.size))
    }

    guard let cgImage = renderedImage.cgImage else {
      throw NSError(domain: "EmailExtractionModule", code: 1004, userInfo: [NSLocalizedDescriptionKey: "Unable to process image"])
    }

    return (cgImage, .up)
  }

  private func makeHighContrastImage(from image: UIImage) -> UIImage? {
    let inputImage: CIImage

    if let ciImage = image.ciImage {
      inputImage = ciImage
    } else if let cgImage = image.cgImage {
      inputImage = CIImage(cgImage: cgImage)
    } else {
      return nil
    }

    guard let filter = CIFilter(name: "CIColorControls") else {
      return nil
    }

    filter.setValue(inputImage, forKey: kCIInputImageKey)
    filter.setValue(0, forKey: kCIInputSaturationKey)
    filter.setValue(1.5, forKey: kCIInputContrastKey)
    filter.setValue(0.1, forKey: kCIInputBrightnessKey)

    guard let outputImage = filter.outputImage else {
      return nil
    }

    let context = CIContext()

    guard let cgImage = context.createCGImage(outputImage, from: outputImage.extent) else {
      return nil
    }

    return UIImage(cgImage: cgImage, scale: image.scale, orientation: .up)
  }

  private func extractTextFromPDF(_ url: URL) throws -> (text: String, warnings: [String]) {
    guard let document = PDFDocument(url: url) else {
      throw NSError(domain: "EmailExtractionModule", code: 1005, userInfo: [NSLocalizedDescriptionKey: "Unable to open PDF file"])
    }

    var collectedText: [String] = []
    var warnings: [String] = []

    for index in 0..<document.pageCount {
      guard let page = document.page(at: index) else {
        continue
      }

      let text = page.string?.trimmingCharacters(in: .whitespacesAndNewlines) ?? ""

      if !text.isEmpty {
        collectedText.append(text)
        continue
      }

      let image = page.thumbnail(of: CGSize(width: 1200, height: 1600), for: .mediaBox)

      do {
        let ocrText = try self.ocrText(from: image)

        if !ocrText.isEmpty {
          collectedText.append(ocrText)
        }
      } catch {
        warnings.append("OCR fallback failed for PDF page \(index + 1)")
      }
    }

    return (collectedText.joined(separator: "\n"), warnings)
  }

  private func extractTextFromTextFile(_ url: URL) throws -> String {
    let encodings: [String.Encoding] = [.utf8, .utf16, .utf16LittleEndian, .utf16BigEndian, .ascii]

    for encoding in encodings {
      if let text = try? String(contentsOf: url, encoding: encoding) {
        return text
      }
    }

    throw NSError(domain: "EmailExtractionModule", code: 1006, userInfo: [NSLocalizedDescriptionKey: "Unable to decode text file"])
  }

  private func extractEmails(from input: String) -> [String] {
    guard !input.isEmpty else {
      return []
    }

    let patterns = [
      (pattern: "[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,63}", permissive: false),
      (pattern: "[A-Z0-9._%+-]+\\s*[@＠]\\s*[A-Z0-9-]+(?:\\s*[.。｡．·•]\\s*[A-Z0-9-]+|\\s*[,:][A-Z0-9-]+)+", permissive: true)
    ]
    var matches: [(value: String, index: Int, permissive: Bool)] = []
    var seen = Set<String>()
    var result: [String] = []

    for matcher in patterns {
      guard let regex = try? NSRegularExpression(pattern: matcher.pattern, options: [.caseInsensitive]) else {
        continue
      }

      let nsRange = NSRange(input.startIndex..<input.endIndex, in: input)

      for match in regex.matches(in: input, options: [], range: nsRange) {
        guard let range = Range(match.range, in: input) else {
          continue
        }

        if matcher.permissive, nextNonWhitespaceCharacter(in: input, from: range.upperBound) == "@" {
          continue
        }

        matches.append((String(input[range]), match.range.location, matcher.permissive))
      }
    }

    matches.sort { left, right in
      if left.index != right.index {
        return left.index < right.index
      }

      return (left.permissive ? 1 : 0) < (right.permissive ? 1 : 0)
    }

    for match in matches {
      guard let normalized = normalizeEmail(match.value, permissive: match.permissive) else {
        continue
      }

      let dedupeKey = normalized.lowercased()

      if seen.contains(dedupeKey) {
        continue
      }

      seen.insert(dedupeKey)
      result.append(normalized)
    }

    return result
  }

  private func nextNonWhitespaceCharacter(in input: String, from index: String.Index) -> Character? {
    var cursor = index

    while cursor < input.endIndex {
      let character = input[cursor]

      if !String(character).trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
        return character
      }

      cursor = input.index(after: cursor)
    }

    return nil
  }

  private func removeZeroWidthCharacters(from value: String) -> String {
    return value
      .replacingOccurrences(of: "\u{200B}", with: "")
      .replacingOccurrences(of: "\u{200C}", with: "")
      .replacingOccurrences(of: "\u{200D}", with: "")
      .replacingOccurrences(of: "\u{FEFF}", with: "")
  }

  private func normalizeEmail(_ email: String, permissive: Bool = false) -> String? {
    let trimmed = removeZeroWidthCharacters(from: email)
      .trimmingCharacters(in: CharacterSet(charactersIn: "[](){}<>\"'`.,;:!? ").union(.whitespacesAndNewlines))
      .replacingOccurrences(of: "＠", with: "@")
      .replacingOccurrences(of: "﹫", with: "@")
    let candidate = permissive
      ? trimmed.replacingOccurrences(of: #"\s*@\s*"#, with: "@", options: .regularExpression)
      : trimmed
    let parts = candidate.split(separator: "@", omittingEmptySubsequences: false)

    guard parts.count == 2 else {
      return nil
    }

    var local = String(parts[0])
    var domainRaw = String(parts[1])

    if permissive {
      local = local.replacingOccurrences(of: #"\s+"#, with: "", options: .regularExpression)
      domainRaw = domainRaw
        .replacingOccurrences(of: #"\s+"#, with: "", options: .regularExpression)
        .unicodeScalars
        .map { "。｡．·•,:".unicodeScalars.contains($0) ? "." : String($0) }
        .joined()
    }

    guard !local.isEmpty,
          !domainRaw.isEmpty,
          local.rangeOfCharacter(from: CharacterSet(charactersIn: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._%+-").inverted) == nil else {
      return nil
    }

    if local.hasPrefix(".") || local.hasSuffix(".") || local.contains("..") {
      return nil
    }

    let domain = domainRaw.lowercased()

    if domain.hasPrefix(".") || domain.hasSuffix(".") || domain.contains("..") || domain.hasPrefix("-") || domain.hasSuffix("-") {
      return nil
    }

    let labels = domain.split(separator: ".", omittingEmptySubsequences: false).map(String.init)

    if labels.contains(where: {
      $0.isEmpty ||
      $0.hasPrefix("-") ||
      $0.hasSuffix("-") ||
      $0.rangeOfCharacter(from: CharacterSet(charactersIn: "abcdefghijklmnopqrstuvwxyz0123456789-").inverted) != nil
    }) {
      return nil
    }

    guard let topLevelLabel = labels.last, topLevelLabel.count >= 2, topLevelLabel.count <= 63 else {
      return nil
    }

    return "\(local)@\(domain)"
  }
}

private extension CGImagePropertyOrientation {
  init(_ orientation: UIImage.Orientation) {
    switch orientation {
    case .up:
      self = .up
    case .down:
      self = .down
    case .left:
      self = .left
    case .right:
      self = .right
    case .upMirrored:
      self = .upMirrored
    case .downMirrored:
      self = .downMirrored
    case .leftMirrored:
      self = .leftMirrored
    case .rightMirrored:
      self = .rightMirrored
    @unknown default:
      self = .up
    }
  }
}
