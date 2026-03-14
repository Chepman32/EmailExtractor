export type ExtractionSource = 'text' | 'camera' | 'photos' | 'files';

export type ExtractionResult = {
  emails: string[];
  source: ExtractionSource;
  rawTextLength: number;
  extractedAt: string;
  warnings: string[];
};

export type HistorySession = {
  id: string;
  source: ExtractionSource;
  emails: string[];
  createdAt: string;
  inputLabel: string;
};
