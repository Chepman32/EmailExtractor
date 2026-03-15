import {createEmptyMatches} from '../../shared/extractedData';
import * as nativeBridge from '../../native/emailExtractionBridge';
import {extractData} from './extractionEngine';
import * as docxExtraction from './docxExtraction';

jest.mock('../../native/emailExtractionBridge', () => ({
  extractFromFile: jest.fn(),
  extractFromImage: jest.fn(),
  extractFromText: jest.fn(),
}));

jest.mock('./docxExtraction', () => ({
  extractTextFromDocxFile: jest.fn(),
}));

describe('extractData', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('preserves the photos source when image extraction resolves natively', async () => {
    jest.spyOn(nativeBridge, 'extractFromImage').mockResolvedValue({
      matches: {
        ...createEmptyMatches(),
        email: ['photo@example.com'],
      },
      source: 'camera',
      rawTextLength: 24,
      extractedAt: '2026-03-11T00:00:00.000Z',
      warnings: [],
    });

    const result = await extractData({
      source: 'photos',
      text: '',
      selectedAsset: {
        uri: 'file:///tmp/imported-photo.jpg',
        name: 'imported-photo.jpg',
        mimeType: 'image/jpeg',
      },
      enabledTypes: ['email'],
    });

    expect(result.source).toBe('photos');
    expect(result.matches.email).toEqual(['photo@example.com']);
  });

  it('routes docx files through the DOCX parser', async () => {
    jest
      .spyOn(docxExtraction, 'extractTextFromDocxFile')
      .mockResolvedValue('docx@example.com');

    const result = await extractData({
      source: 'files',
      text: '',
      selectedAsset: {
        uri: 'file:///tmp/leads.docx',
        name: 'leads.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
      enabledTypes: ['email'],
    });

    expect(docxExtraction.extractTextFromDocxFile).toHaveBeenCalledWith(
      'file:///tmp/leads.docx',
    );
    expect(result.source).toBe('files');
    expect(result.matches.email).toEqual(['docx@example.com']);
  });
});
