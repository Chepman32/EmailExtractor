import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  persistDataTypeSelection,
  readDataTypeSelection,
} from './dataTypeStorage';

describe('dataTypeStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('returns the default selection when nothing is stored', async () => {
    await expect(readDataTypeSelection()).resolves.toEqual({
      email: true,
      date: false,
      link: false,
    });
  });

  it('persists and reads data type selections', async () => {
    await persistDataTypeSelection({
      email: true,
      date: true,
      link: false,
    });

    await expect(readDataTypeSelection()).resolves.toEqual({
      email: true,
      date: true,
      link: false,
    });
  });

  it('falls back to defaults for invalid stored payloads', async () => {
    await AsyncStorage.setItem(
      'emailExtractor.dataTypes.v1',
      JSON.stringify({email: true, date: 'yes', link: false}),
    );

    await expect(readDataTypeSelection()).resolves.toEqual({
      email: true,
      date: false,
      link: false,
    });
  });
});
