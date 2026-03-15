import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistHistory, readHistory} from './historyStorage';
import {createHistorySession} from './historyStore';
import {createEmptyMatches} from '../../shared/extractedData';

describe('historyStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('persists and reads sessions', async () => {
    const sessions = [
      createHistorySession(
        'text',
        {
          ...createEmptyMatches(),
          email: ['a@example.com'],
        },
        'A',
      ),
    ];

    await persistHistory(sessions);
    const loaded = await readHistory();

    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.matches.email).toEqual(['a@example.com']);
  });

  it('normalizes legacy email-only sessions on read', async () => {
    await AsyncStorage.setItem(
      'emailExtractor.history.v1',
      JSON.stringify([
        {
          id: 'legacy-1',
          source: 'files',
          emails: ['legacy@example.com'],
          createdAt: '2026-03-11T00:00:00.000Z',
          inputLabel: 'Legacy.pdf',
        },
      ]),
    );

    const loaded = await readHistory();

    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.matches.email).toEqual(['legacy@example.com']);
    expect(loaded[0]?.matches.date).toEqual([]);
    expect(loaded[0]?.matches.link).toEqual([]);
  });
});
