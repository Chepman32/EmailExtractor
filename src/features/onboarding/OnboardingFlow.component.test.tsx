import React from 'react';
import {fireEvent, render, waitFor} from '@testing-library/react-native';

import {createDefaultDataTypeSelection} from '../../shared/extractedData';
import {themes} from '../../theme/themes';
import {OnboardingFlow} from './OnboardingFlow';

describe('OnboardingFlow', () => {
  it('walks through the questionnaire and returns the chosen extraction focus', async () => {
    const onComplete = jest.fn();
    const {getByTestId, getByText} = render(
      <OnboardingFlow
        initialSelection={createDefaultDataTypeSelection()}
        onComplete={onComplete}
        theme={themes.light}
      />,
    );

    fireEvent.press(getByTestId('onboarding-primary'));
    fireEvent.press(getByTestId('onboarding-goal-date'));
    fireEvent.press(getByTestId('onboarding-primary'));
    fireEvent.press(getByTestId('onboarding-pain-screenshots'));
    fireEvent.press(getByTestId('onboarding-primary'));
    fireEvent.press(getByTestId('onboarding-source-files'));
    fireEvent.press(getByTestId('onboarding-primary'));
    fireEvent.press(getByTestId('onboarding-primary'));

    await waitFor(() => {
      expect(getByText('hello@northstar.studio')).toBeTruthy();
      expect(getByText('https://northstar.studio/invite')).toBeTruthy();
    });

    fireEvent.press(getByTestId('onboarding-primary'));
    fireEvent.press(getByTestId('onboarding-primary'));

    expect(onComplete).toHaveBeenCalledWith({
      email: true,
      date: false,
      link: true,
    });
  });
});
