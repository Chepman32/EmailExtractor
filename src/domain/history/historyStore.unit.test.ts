import {
  addSessionToHistory,
  clearHistory,
  createHistorySession,
  HISTORY_LIMIT,
} from './historyStore';

describe('historyStore', () => {
  it('creates a session shape with required fields', () => {
    const session = createHistorySession('text', ['a@example.com'], 'Manual text');

    expect(session.id).toBeTruthy();
    expect(session.source).toBe('text');
    expect(session.emails).toEqual(['a@example.com']);
    expect(session.inputLabel).toBe('Manual text');
    expect(session.createdAt).toMatch(/\d{4}-\d{2}-\d{2}T/);
  });

  it('prepends new sessions and caps history size', () => {
    const sessions = Array.from({length: HISTORY_LIMIT}, (_, idx) =>
      createHistorySession('text', [`user${idx}@example.com`], `Entry ${idx}`),
    );

    const next = addSessionToHistory(sessions, createHistorySession('files', ['latest@example.com'], 'Latest'));

    expect(next.length).toBe(HISTORY_LIMIT);
    expect(next[0].emails).toEqual(['latest@example.com']);
  });

  it('clears history', () => {
    const sessions = [createHistorySession('text', ['a@example.com'], 'A')];
    expect(clearHistory(sessions)).toEqual([]);
  });
});
