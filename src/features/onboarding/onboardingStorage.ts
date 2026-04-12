import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'emailExtractor.onboarding.v1';

export async function readOnboardingCompletion(): Promise<boolean> {
  try {
    return (await AsyncStorage.getItem(STORAGE_KEY)) === 'complete';
  } catch {
    return false;
  }
}

export async function persistOnboardingCompletion(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, 'complete');
}
