import {extractEmails} from './extractionEngine';
import * as nativeBridge from '../../native/emailExtractionBridge';
import * as docxExtraction from './docxExtraction';

jest.mock('../../native/emailExtractionBridge', () => ({
  extractFromFile: jest.fn(),
  extractFromImage: jest.fn(),
  extractFromText: jest.fn(),
}));

jest.mock('./docxExtraction', () => ({
  extractEmailsFromDocxFile: jest.fn(),
}));

describe('extractEmails', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('preserves the photos source when image extraction resolves natively', async () => {
    jest.spyOn(nativeBridge, 'extractFromImage').mockResolvedValue({
      emails: ['photo@example.com'],
      source: 'camera',
      rawTextLength: 24,
      extractedAt: '2026-03-11T00:00:00.000Z',
      warnings: [],
    });

    const result = await extractEmails({
      source: 'photos',
      text: '',
      selectedAsset: {
        uri: 'file:///tmp/imported-photo.jpg',
        name: 'imported-photo.jpg',
        mimeType: 'image/jpeg',
      },
    });

    expect(result.source).toBe('photos');
    expect(result.emails).toEqual(['photo@example.com']);
  });

  it('routes docx files through the DOCX parser', async () => {
    jest
      .spyOn(docxExtraction, 'extractEmailsFromDocxFile')
      .mockResolvedValue(['docx@example.com']);

    const result = await extractEmails({
      source: 'files',
      text: '',
      selectedAsset: {
        uri: 'file:///tmp/leads.docx',
        name: 'leads.docx',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    });

    expect(docxExtraction.extractEmailsFromDocxFile).toHaveBeenCalledWith(
      'file:///tmp/leads.docx',
    );
    expect(result.source).toBe('files');
    expect(result.emails).toEqual(['docx@example.com']);
  });
});
