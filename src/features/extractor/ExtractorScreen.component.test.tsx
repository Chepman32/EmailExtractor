import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {ExtractorScreen} from './ExtractorScreen';
import * as historyStorage from '../../domain/history/historyStorage';
import * as extractionEngine from './extractionEngine';

describe('ExtractorScreen', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(historyStorage, 'readHistory').mockResolvedValue([]);
  });

  it('shows initial empty-state UI', async () => {
    const {getByText, getByTestId} = render(<ExtractorScreen />);

    await waitFor(() => {
      expect(getByText('Email Extractor')).toBeTruthy();
      expect(getByText('Text')).toBeTruthy();
      expect(getByText('Camera')).toBeTruthy();
      expect(getByText('Photos')).toBeTruthy();
      expect(getByText('Files')).toBeTruthy();
      expect(getByText('No emails found')).toBeTruthy();
      expect(getByTestId('extract-button')).toBeDisabled();
    });
  });

  it('keeps a reset action available below the source picker', () => {
    const {getByTestId} = render(<ExtractorScreen />);

    expect(getByTestId('clear-button')).toBeTruthy();
  });

  it('pastes clipboard content into the text input when the paste icon is pressed', async () => {
    jest
      .spyOn(Clipboard, 'getString')
      .mockResolvedValue('clipboard@example.com');

    const {getByTestId, getByDisplayValue} = render(<ExtractorScreen />);

    fireEvent.press(getByTestId('paste-button'));

    await waitFor(() => {
      expect(getByDisplayValue('clipboard@example.com')).toBeTruthy();
    });
  });

  it('keeps extracted results visible when history persistence fails', async () => {
    jest.spyOn(extractionEngine, 'extractEmails').mockResolvedValue({
      emails: ['antonkerch555@gmail.com'],
      source: 'text',
      rawTextLength: 25,
      extractedAt: '2026-03-14T00:00:00.000Z',
      warnings: [],
    });
    jest
      .spyOn(historyStorage, 'persistHistory')
      .mockRejectedValue(new Error('storage unavailable'));

    const {getByPlaceholderText, getByTestId, getByText} = render(<ExtractorScreen />);

    await waitFor(() => {
      expect(getByTestId('extract-button')).toBeDisabled();
    });

    fireEvent.changeText(
      getByPlaceholderText('Paste text to scan for email addresses'),
      'antonkerch555@gmail.com',
    );
    fireEvent.press(getByTestId('extract-button'));

    await waitFor(() => {
      expect(getByText('antonkerch555@gmail.com')).toBeTruthy();
      expect(
        getByText('Emails were extracted, but history could not be saved.'),
      ).toBeTruthy();
    });
  });
});
