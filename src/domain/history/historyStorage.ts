import AsyncStorage from '@react-native-async-storage/async-storage';
import {HistorySession} from '../../shared/types';

const STORAGE_KEY = 'emailExtractor.history.v1';

function isHistorySession(value: unknown): value is HistorySession {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    typeof candidate.source === 'string' &&
    Array.isArray(candidate.emails) &&
    candidate.emails.every(item => typeof item === 'string') &&
    typeof candidate.createdAt === 'string' &&
    typeof candidate.inputLabel === 'string'
  );
}

export async function readHistory(): Promise<HistorySession[]> {
  const rawValue = await AsyncStorage.getItem(STORAGE_KEY);

  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isHistorySession);
  } catch {
    return [];
  }
}

export async function persistHistory(sessions: HistorySession[]): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export async function clearPersistedHistory(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
}
