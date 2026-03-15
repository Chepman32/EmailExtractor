import {NativeModules} from 'react-native';
import {createEmptyMatches} from '../shared/extractedData';
import {
  extractFromFile,
  extractFromImage,
  extractFromText,
  exportExtractedItems,
} from '../native/emailExtractionBridge';

describe('emailExtractionBridge', () => {
  beforeEach(() => {
    NativeModules.EmailExtractionModule = {
      extractFromText: jest.fn(async (input: string) => ({
        matches: {
          ...createEmptyMatches(),
          email: ['a@example.com'],
        },
        source: 'text',
        rawTextLength: input.length,
        extractedAt: '2026-01-01T00:00:00.000Z',
        warnings: [],
      })),
      extractFromImage: jest.fn(async () => ({
        matches: {
          ...createEmptyMatches(),
          email: ['image@example.com'],
        },
        source: 'camera',
        rawTextLength: 10,
        extractedAt: '2026-01-01T00:00:00.000Z',
        warnings: [],
      })),
      extractFromFile: jest.fn(async () => ({
        matches: {
          ...createEmptyMatches(),
          email: ['file@example.com'],
        },
        source: 'files',
        rawTextLength: 10,
        extractedAt: '2026-01-01T00:00:00.000Z',
        warnings: [],
      })),
      exportExtractedItems: jest.fn(async () => ({fileUri: 'file:///tmp/out.csv'})),
    };
  });

  it('forwards extractFromText to native module', async () => {
    const result = await extractFromText('hello a@example.com', ['email']);
    expect(result.matches.email).toEqual(['a@example.com']);
  });

  it('forwards extractFromImage to native module', async () => {
    const result = await extractFromImage('file:///tmp/image.jpg', ['email']);
    expect(result.matches.email).toEqual(['image@example.com']);
  });

  it('forwards extractFromFile to native module', async () => {
    const result = await extractFromFile('file:///tmp/a.pdf', 'application/pdf', ['email']);
    expect(result.matches.email).toEqual(['file@example.com']);
  });

  it('forwards exportExtractedItems to native module', async () => {
    const result = await exportExtractedItems('email', ['a@example.com'], 'csv');
    expect(result.fileUri).toContain('out.csv');
  });
});
