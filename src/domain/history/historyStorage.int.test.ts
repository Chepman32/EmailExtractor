import AsyncStorage from '@react-native-async-storage/async-storage';
import {persistHistory, readHistory} from './historyStorage';
import {createHistorySession} from './historyStore';

describe('historyStorage', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('persists and reads sessions', async () => {
    const sessions = [createHistorySession('text', ['a@example.com'], 'A')];

    await persistHistory(sessions);
    const loaded = await readHistory();

    expect(loaded).toHaveLength(1);
    expect(loaded[0]?.emails).toEqual(['a@example.com']);
  });
});
