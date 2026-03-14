import {NativeModules} from 'react-native';
import {ExtractionResult} from '../shared/types';

type ExportFormat = 'txt' | 'csv';

type EmailExtractionNativeModule = {
  extractFromText(input: string): Promise<ExtractionResult>;
  extractFromImage(fileUri: string): Promise<ExtractionResult>;
  extractFromFile(fileUri: string, mimeType?: string): Promise<ExtractionResult>;
  exportEmails(emails: string[], format: ExportFormat): Promise<{fileUri: string}>;
};

function requireModule(): EmailExtractionNativeModule {
  const nativeModule = NativeModules.EmailExtractionModule as
    | EmailExtractionNativeModule
    | undefined;

  if (!nativeModule) {
    throw new Error('EmailExtractionModule is not available');
  }

  return nativeModule;
}

export async function extractFromText(input: string): Promise<ExtractionResult> {
  return requireModule().extractFromText(input);
}

export async function extractFromImage(fileUri: string): Promise<ExtractionResult> {
  return requireModule().extractFromImage(fileUri);
}

export async function extractFromFile(
  fileUri: string,
  mimeType?: string,
): Promise<ExtractionResult> {
  return requireModule().extractFromFile(fileUri, mimeType);
}

export async function exportEmails(
  emails: string[],
  format: ExportFormat,
): Promise<{fileUri: string}> {
  return requireModule().exportEmails(emails, format);
}
