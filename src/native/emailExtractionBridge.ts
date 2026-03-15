import {NativeModules} from 'react-native';
import {ExtractableDataType} from '../shared/extractedData';
import {ExtractionResult} from '../shared/types';

type ExportFormat = 'txt' | 'csv';

type EmailExtractionNativeModule = {
  extractFromText(
    input: string,
    enabledTypes: ExtractableDataType[],
  ): Promise<ExtractionResult>;
  extractFromImage(
    fileUri: string,
    enabledTypes: ExtractableDataType[],
  ): Promise<ExtractionResult>;
  extractFromFile(
    fileUri: string,
    mimeType: string | undefined,
    enabledTypes: ExtractableDataType[],
  ): Promise<ExtractionResult>;
  exportExtractedItems(
    itemType: ExtractableDataType,
    items: string[],
    format: ExportFormat,
  ): Promise<{fileUri: string}>;
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

export async function extractFromText(
  input: string,
  enabledTypes: ExtractableDataType[],
): Promise<ExtractionResult> {
  return requireModule().extractFromText(input, enabledTypes);
}

export async function extractFromImage(
  fileUri: string,
  enabledTypes: ExtractableDataType[],
): Promise<ExtractionResult> {
  return requireModule().extractFromImage(fileUri, enabledTypes);
}

export async function extractFromFile(
  fileUri: string,
  mimeType?: string,
  enabledTypes: ExtractableDataType[] = ['email'],
): Promise<ExtractionResult> {
  return requireModule().extractFromFile(fileUri, mimeType, enabledTypes);
}

export async function exportExtractedItems(
  itemType: ExtractableDataType,
  items: string[],
  format: ExportFormat,
): Promise<{fileUri: string}> {
  return requireModule().exportExtractedItems(itemType, items, format);
}
