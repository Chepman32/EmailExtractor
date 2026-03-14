import {NativeModules} from 'react-native';
import {
  extractFromFile,
  extractFromImage,
  extractFromText,
  exportEmails,
} from '../native/emailExtractionBridge';

describe('emailExtractionBridge', () => {
  beforeEach(() => {
    NativeModules.EmailExtractionModule = {
      extractFromText: jest.fn(async (input: string) => ({
        emails: ['a@example.com'],
        source: 'text',
        rawTextLength: input.length,
        extractedAt: '2026-01-01T00:00:00.000Z',
        warnings: [],
      })),
      extractFromImage: jest.fn(async () => ({
        emails: ['image@example.com'],
        source: 'camera',
        rawTextLength: 10,
        extractedAt: '2026-01-01T00:00:00.000Z',
        warnings: [],
      })),
      extractFromFile: jest.fn(async () => ({
        emails: ['file@example.com'],
        source: 'files',
        rawTextLength: 10,
        extractedAt: '2026-01-01T00:00:00.000Z',
        warnings: [],
      })),
      exportEmails: jest.fn(async () => ({fileUri: 'file:///tmp/out.csv'})),
    };
  });

  it('forwards extractFromText to native module', async () => {
    const result = await extractFromText('hello a@example.com');
    expect(result.emails).toEqual(['a@example.com']);
  });

  it('forwards extractFromImage to native module', async () => {
    const result = await extractFromImage('file:///tmp/image.jpg');
    expect(result.emails).toEqual(['image@example.com']);
  });

  it('forwards extractFromFile to native module', async () => {
    const result = await extractFromFile('file:///tmp/a.pdf', 'application/pdf');
    expect(result.emails).toEqual(['file@example.com']);
  });

  it('forwards exportEmails to native module', async () => {
    const result = await exportEmails(['a@example.com'], 'csv');
    expect(result.fileUri).toContain('out.csv');
  });
});
