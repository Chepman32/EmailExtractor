import {ExtractedMatches} from './extractedData';

export const EXTRACTION_SOURCES = ['text', 'camera', 'photos', 'files'] as const;

export type ExtractionSource = (typeof EXTRACTION_SOURCES)[number];

export function isExtractionSource(value: unknown): value is ExtractionSource {
  return (
    typeof value === 'string' &&
    (EXTRACTION_SOURCES as readonly string[]).includes(value)
  );
}

export type ExtractionResult = {
  matches: ExtractedMatches;
  source: ExtractionSource;
  rawTextLength: number;
  extractedAt: string;
  warnings: string[];
};

export type HistorySession = {
  id: string;
  source: ExtractionSource;
  matches: ExtractedMatches;
  createdAt: string;
  inputLabel: string;
};
