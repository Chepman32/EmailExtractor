import {HistorySession, ExtractionSource} from '../../shared/types';
import {ExtractedMatches} from '../../shared/extractedData';

export const HISTORY_LIMIT = 100;

export function createHistorySession(
  source: ExtractionSource,
  matches: ExtractedMatches,
  inputLabel: string,
): HistorySession {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return {
    id,
    source,
    matches,
    createdAt: new Date().toISOString(),
    inputLabel,
  };
}

export function addSessionToHistory(
  sessions: HistorySession[],
  session: HistorySession,
): HistorySession[] {
  return [session, ...sessions].slice(0, HISTORY_LIMIT);
}

export function clearHistory(_sessions: HistorySession[]): HistorySession[] {
  return [];
}
