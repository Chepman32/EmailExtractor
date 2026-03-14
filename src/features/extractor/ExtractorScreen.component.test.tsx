import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';
import {ExtractorScreen} from './ExtractorScreen';
import * as historyStorage from '../../domain/history/historyStorage';
import {HistorySession} from '../../shared/types';
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

  it('restores imported-source labels from history sessions', async () => {
    const historySession: HistorySession = {
      id: 'session-1',
      source: 'files',
      emails: ['team@example.com'],
      createdAt: '2026-03-11T00:00:00.000Z',
      inputLabel: 'Imported.pdf',
    };

    jest.spyOn(historyStorage, 'readHistory').mockResolvedValue([historySession]);

    const {getByTestId, getByText, queryByText} = render(<ExtractorScreen />);

    await waitFor(() => {
      expect(getByTestId('history-button')).toBeTruthy();
    });

    fireEvent.press(getByTestId('history-button'));

    await waitFor(() => {
      expect(getByText('Imported.pdf')).toBeTruthy();
    });

    fireEvent.press(getByText('Imported.pdf'));

    await waitFor(() => {
      expect(getByText('team@example.com')).toBeTruthy();
      expect(queryByText('No source selected')).toBeNull();
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
