import {extractEmailsFromText} from '../../domain/email/parseEmails';
import {
  createEmptyMatches,
  ExtractedMatches,
} from '../../shared/extractedData';
import {ExtractionResult} from '../../shared/types';
import {
  extractFromFile,
  extractFromImage,
  extractFromText as nativeExtractFromText,
} from '../../native/emailExtractionBridge';
import {extractTextFromDocxFile} from './docxExtraction';
import {ExtractionInput} from './types';

function createResult(
  matches: ExtractedMatches,
  source: ExtractionResult['source'],
  rawTextLength: number,
  warnings: string[] = [],
): ExtractionResult {
  return {
    matches,
    source,
    rawTextLength,
    warnings,
    extractedAt: new Date().toISOString(),
  };
}

function createEmailOnlyMatches(emails: string[]): ExtractedMatches {
  return {
    ...createEmptyMatches(),
    email: emails,
  };
}

function isEmailOnlySelection(enabledTypes: ExtractionInput['enabledTypes']): boolean {
  return enabledTypes.length === 1 && enabledTypes[0] === 'email';
}

function getExtension(nameOrUri: string | undefined): string {
  if (!nameOrUri) {
    return '';
  }

  const cleaned = nameOrUri.split('?')[0]?.split('#')[0] ?? '';
  const extension = cleaned.split('.').pop() ?? '';

  return extension.toLowerCase();
}

export async function extractData(input: ExtractionInput): Promise<ExtractionResult> {
  if (input.source === 'text') {
    const isEmailOnly = isEmailOnlySelection(input.enabledTypes);
    const jsEmails = isEmailOnly ? extractEmailsFromText(input.text) : [];

    if (jsEmails.length > 0) {
      return createResult(
        createEmailOnlyMatches(jsEmails),
        'text',
        input.text.length,
      );
    }

    try {
      return await nativeExtractFromText(input.text, input.enabledTypes);
    } catch {
      if (isEmailOnly) {
        return createResult(createEmptyMatches(), 'text', input.text.length);
      }

      throw new Error('error.extract.multiTypeUnavailable');
    }
  }

  if (!input.selectedAsset?.uri) {
    throw new Error('error.extract.noSourceAsset');
  }

  if (input.source === 'camera' || input.source === 'photos') {
    const result = await extractFromImage(
      input.selectedAsset.uri,
      input.enabledTypes,
    );

    return {
      ...result,
      source: input.source,
    };
  }

  const extension = getExtension(input.selectedAsset.name ?? input.selectedAsset.uri);

  if (extension === 'docx') {
    const docxText = await extractTextFromDocxFile(input.selectedAsset.uri);

    if (isEmailOnlySelection(input.enabledTypes)) {
      return createResult(
        createEmailOnlyMatches(extractEmailsFromText(docxText)),
        'files',
        docxText.length,
      );
    }

    const result = await nativeExtractFromText(docxText, input.enabledTypes);

    return {
      ...result,
      source: 'files',
      rawTextLength: docxText.length,
    };
  }

  return extractFromFile(
    input.selectedAsset.uri,
    input.selectedAsset.mimeType ?? undefined,
    input.enabledTypes,
  );
}
