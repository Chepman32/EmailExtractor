import AsyncStorage from '@react-native-async-storage/async-storage';

import {SupportedLocale} from './translations';

const STORAGE_KEY = 'pluq.locale.v1';

export async function readLocalePreference(): Promise<SupportedLocale | null> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value as SupportedLocale | null;
  } catch {
    return null;
  }
}

export async function persistLocalePreference(
  locale: SupportedLocale | null,
): Promise<void> {
  if (locale === null) {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } else {
    await AsyncStorage.setItem(STORAGE_KEY, locale);
  }
}
