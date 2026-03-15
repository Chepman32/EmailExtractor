import AsyncStorage from '@react-native-async-storage/async-storage';
import {HistorySession, isExtractionSource} from '../../shared/types';
import {createEmptyMatches, isExtractedMatches} from '../../shared/extractedData';

const STORAGE_KEY = 'emailExtractor.history.v1';

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

function normalizeHistorySession(value: unknown): HistorySession | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const candidate = value as Record<string, unknown>;

  if (
    typeof candidate.id !== 'string' ||
    !isExtractionSource(candidate.source) ||
    typeof candidate.createdAt !== 'string' ||
    typeof candidate.inputLabel !== 'string'
  ) {
    return null;
  }

  if (isExtractedMatches(candidate.matches)) {
    return {
      id: candidate.id,
      source: candidate.source,
      matches: candidate.matches,
      createdAt: candidate.createdAt,
      inputLabel: candidate.inputLabel,
    };
  }

  if (isStringArray(candidate.emails)) {
    return {
      id: candidate.id,
      source: candidate.source,
      matches: {
        ...createEmptyMatches(),
        email: candidate.emails,
      },
      createdAt: candidate.createdAt,
      inputLabel: candidate.inputLabel,
    };
  }

  return null;
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

    return parsed.flatMap(value => {
      const session = normalizeHistorySession(value);
      return session ? [session] : [];
    });
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
