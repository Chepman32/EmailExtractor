import AsyncStorage from '@react-native-async-storage/async-storage';

import {defaultThemeId, isThemeId, ThemeId} from './themes';

const STORAGE_KEY = 'emailExtractor.theme.v1';

export async function readThemePreference(): Promise<ThemeId> {
  try {
    const rawValue = await AsyncStorage.getItem(STORAGE_KEY);

    if (!isThemeId(rawValue)) {
      return defaultThemeId;
    }

    return rawValue;
  } catch {
    return defaultThemeId;
  }
}

export async function persistThemePreference(themeId: ThemeId): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, themeId);
}
