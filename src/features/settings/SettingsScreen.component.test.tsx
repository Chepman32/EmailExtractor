import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';

import {createDefaultDataTypeSelection} from '../../shared/extractedData';
import {SettingsScreen} from './SettingsScreen';

describe('SettingsScreen', () => {
  it('renders the data types card', () => {
    const {getByText} = render(
      <SettingsScreen
        dataTypeSelection={createDefaultDataTypeSelection()}
        onDataTypeSelectionChange={jest.fn()}
        onThemeChange={jest.fn()}
        selectedThemeId="light"
      />,
    );

    expect(getByText('Choose what to extract')).toBeTruthy();
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Dates')).toBeTruthy();
    expect(getByText('Links')).toBeTruthy();
  });

  it('blocks deselecting the last enabled data type', () => {
    const onDataTypeSelectionChange = jest.fn();
    const {getByTestId, getByText} = render(
      <SettingsScreen
        dataTypeSelection={{email: true, date: false, link: false}}
        onDataTypeSelectionChange={onDataTypeSelectionChange}
        onThemeChange={jest.fn()}
        selectedThemeId="light"
      />,
    );

    fireEvent.press(getByTestId('data-type-email'));

    expect(onDataTypeSelectionChange).not.toHaveBeenCalled();
    expect(getByText('Select at least one data type.')).toBeTruthy();
  });
});
