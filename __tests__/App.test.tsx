import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';

import App from '../App';
import {createEmptyMatches} from '../src/shared/extractedData';
import * as historyStorage from '../src/domain/history/historyStorage';
import * as onboardingStorage from '../src/features/onboarding/onboardingStorage';
import {HistorySession} from '../src/shared/types';

describe('App navigation', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.spyOn(historyStorage, 'readHistory').mockResolvedValue([]);
    jest
      .spyOn(onboardingStorage, 'readOnboardingCompletion')
      .mockResolvedValue(true);
  });

  it('renders bottom tabs and the home screen by default', async () => {
    const {getByTestId, getByText} = render(<App />);

    await waitFor(() => {
      expect(getByTestId('tab-home')).toBeTruthy();
      expect(getByTestId('tab-history')).toBeTruthy();
      expect(getByTestId('tab-settings')).toBeTruthy();
      expect(getByText('Data Extractor')).toBeTruthy();
    });
  });

  it('shows onboarding on first launch before the main app', async () => {
    jest
      .spyOn(onboardingStorage, 'readOnboardingCompletion')
      .mockResolvedValue(false);

    const {getByTestId, getByText} = render(<App />);

    await waitFor(() => {
      expect(getByTestId('onboarding-root')).toBeTruthy();
      expect(getByText('Turn messy messages into clean details')).toBeTruthy();
    });
  });

  it('loads a saved session from history back into the home screen', async () => {
    const historySession: HistorySession = {
      id: 'session-1',
      source: 'files',
      matches: {
        ...createEmptyMatches(),
        email: ['team@example.com'],
      },
      createdAt: '2026-03-11T00:00:00.000Z',
      inputLabel: 'Imported.pdf',
    };

    jest.spyOn(historyStorage, 'readHistory').mockResolvedValue([historySession]);

    const {getByTestId, getByText} = render(<App />);

    await waitFor(() => {
      expect(getByTestId('tab-history')).toBeTruthy();
    });

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

    await waitFor(() => {
      expect(getByTestId('tab-settings')).toBeTruthy();
    });

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
