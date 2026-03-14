import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';

import App from '../App';
import * as historyStorage from '../src/domain/history/historyStorage';
import {HistorySession} from '../src/shared/types';

describe('App navigation', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(historyStorage, 'readHistory').mockResolvedValue([]);
  });

  it('renders bottom tabs and the home screen by default', async () => {
    const {getByTestId, getByText} = render(<App />);

    await waitFor(() => {
      expect(getByTestId('tab-home')).toBeTruthy();
      expect(getByTestId('tab-history')).toBeTruthy();
      expect(getByTestId('tab-settings')).toBeTruthy();
      expect(getByText('Email Extractor')).toBeTruthy();
    });
  });

  it('loads a saved session from history back into the home screen', async () => {
    const historySession: HistorySession = {
      id: 'session-1',
      source: 'files',
      emails: ['team@example.com'],
      createdAt: '2026-03-11T00:00:00.000Z',
      inputLabel: 'Imported.pdf',
    };

    jest.spyOn(historyStorage, 'readHistory').mockResolvedValue([historySession]);

    const {getByTestId, getByText} = render(<App />);

    fireEvent.press(getByTestId('tab-history'));

    await waitFor(() => {
      expect(getByText('Imported.pdf')).toBeTruthy();
    });

    fireEvent.press(getByText('Imported.pdf'));

    await waitFor(() => {
      expect(getByText('team@example.com')).toBeTruthy();
      expect(getByText('Files source')).toBeTruthy();
    });
  });

  it('switches theme from the settings screen', async () => {
    const {getByTestId, getByText} = render(<App />);

    fireEvent.press(getByTestId('tab-settings'));

    await waitFor(() => {
      expect(getByText('Choose a look')).toBeTruthy();
    });

    fireEvent.press(getByTestId('theme-dark'));

    await waitFor(() => {
      expect(getByText('Dark theme applied.')).toBeTruthy();
    });
  });
});
