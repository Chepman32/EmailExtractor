import {extractEmailsFromText} from '../../domain/email/parseEmails';
import {ExtractionResult} from '../../shared/types';
import {
  extractFromFile,
  extractFromImage,
  extractFromText as nativeExtractFromText,
} from '../../native/emailExtractionBridge';
import {extractEmailsFromDocxFile} from './docxExtraction';
import {ExtractionInput} from './types';

function createResult(
  emails: string[],
  source: ExtractionResult['source'],
  rawTextLength: number,
  warnings: string[] = [],
): ExtractionResult {
  return {
    emails,
    source,
    rawTextLength,
    warnings,
    extractedAt: new Date().toISOString(),
  };
}

function getExtension(nameOrUri: string | undefined): string {
  if (!nameOrUri) {
    return '';
  }

  const cleaned = nameOrUri.split('?')[0]?.split('#')[0] ?? '';
  const extension = cleaned.split('.').pop() ?? '';

  return extension.toLowerCase();
}

export async function extractEmails(input: ExtractionInput): Promise<ExtractionResult> {
  if (input.source === 'text') {
    const jsEmails = extractEmailsFromText(input.text);

    if (jsEmails.length > 0) {
      return createResult(jsEmails, 'text', input.text.length);
    }

    try {
      return await nativeExtractFromText(input.text);
    } catch {
      return createResult([], 'text', input.text.length);
    }
  }

  if (!input.selectedAsset?.uri) {
    throw new Error('No source asset selected');
  }

  if (input.source === 'camera' || input.source === 'photos') {
    const result = await extractFromImage(input.selectedAsset.uri);

    return {
      ...result,
      source: input.source,
    };
  }

  const extension = getExtension(input.selectedAsset.name ?? input.selectedAsset.uri);

  if (extension === 'docx') {
    const emails = await extractEmailsFromDocxFile(input.selectedAsset.uri);

    return createResult(emails, 'files', 0);
  }

  return extractFromFile(input.selectedAsset.uri, input.selectedAsset.mimeType ?? undefined);
}
