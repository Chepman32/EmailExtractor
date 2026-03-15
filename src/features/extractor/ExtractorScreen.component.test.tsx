import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {ExtractorScreen} from './ExtractorScreen';
import * as historyStorage from '../../domain/history/historyStorage';
import * as extractionEngine from './extractionEngine';
import {createDefaultDataTypeSelection, createEmptyMatches} from '../../shared/extractedData';

const defaultDataTypeSelection = createDefaultDataTypeSelection();

describe('ExtractorScreen', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(historyStorage, 'readHistory').mockResolvedValue([]);
  });

  it('shows initial empty-state UI', async () => {
    const {getByText, getByTestId} = render(
      <ExtractorScreen dataTypeSelection={defaultDataTypeSelection} />,
    );

    await waitFor(() => {
      expect(getByText('Data Extractor')).toBeTruthy();
      expect(getByText('Text')).toBeTruthy();
      expect(getByText('Camera')).toBeTruthy();
      expect(getByText('Photos')).toBeTruthy();
      expect(getByText('Files')).toBeTruthy();
      expect(getByText('No results found')).toBeTruthy();
      expect(getByTestId('extract-button')).toBeDisabled();
    });
  });

  it('keeps a reset action available below the source picker', () => {
    const {getByTestId} = render(
      <ExtractorScreen dataTypeSelection={defaultDataTypeSelection} />,
    );

    expect(getByTestId('clear-button')).toBeTruthy();
  });

  it('pastes clipboard content into the text input when the paste icon is pressed', async () => {
    jest
      .spyOn(Clipboard, 'getString')
      .mockResolvedValue('clipboard@example.com');

    const {getByTestId, getByDisplayValue} = render(
      <ExtractorScreen dataTypeSelection={defaultDataTypeSelection} />,
    );

    fireEvent.press(getByTestId('paste-button'));

    await waitFor(() => {
      expect(getByDisplayValue('clipboard@example.com')).toBeTruthy();
    });
  });

  it('keeps extracted results visible when history persistence fails', async () => {
    jest.spyOn(extractionEngine, 'extractData').mockResolvedValue({
      matches: {
        ...createEmptyMatches(),
        email: ['antonkerch555@gmail.com'],
      },
      source: 'text',
      rawTextLength: 25,
      extractedAt: '2026-03-14T00:00:00.000Z',
      warnings: [],
    });
    jest
      .spyOn(historyStorage, 'persistHistory')
      .mockRejectedValue(new Error('storage unavailable'));

    const {getByPlaceholderText, getByTestId, getByText} = render(
      <ExtractorScreen dataTypeSelection={defaultDataTypeSelection} />,
    );

    await waitFor(() => {
      expect(getByTestId('extract-button')).toBeDisabled();
    });

    fireEvent.changeText(
      getByPlaceholderText('Paste text to scan for the selected data types'),
      'antonkerch555@gmail.com',
    );
    fireEvent.press(getByTestId('extract-button'));

    await waitFor(() => {
      expect(getByText('antonkerch555@gmail.com')).toBeTruthy();
      expect(
        getByText('Results were extracted, but history could not be saved.'),
      ).toBeTruthy();
    });
  });
});
