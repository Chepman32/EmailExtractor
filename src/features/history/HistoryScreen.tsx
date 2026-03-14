import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {readHistory} from '../../domain/history/historyStorage';
import {HistorySession} from '../../shared/types';

type HistoryScreenProps = {
  isActive: boolean;
  onSelectSession: (session: HistorySession) => void;
};

const CARD_SHADOW = {
  shadowColor: '#0C2340',
  shadowOpacity: 0.08,
  shadowRadius: 18,
  shadowOffset: {width: 0, height: 10},
  elevation: 4,
};

function formatSessionDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unknown time';
  }

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function sourceLabel(source: string) {
  if (source === 'camera') {
    return 'Camera';
  }

  if (source === 'photos') {
    return 'Photos';
  }

  if (source === 'files') {
    return 'Files';
  }

  return 'Text';
}

export function HistoryScreen({isActive, onSelectSession}: HistoryScreenProps) {
  const {width} = useWindowDimensions();
  const isTablet = width >= 768;
  const [sessions, setSessions] = useState<HistorySession[]>([]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    readHistory()
      .then(setSessions)
      .catch(() => {
        setSessions([]);
      });
  }, [isActive]);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <FlatList
        data={sessions}
        keyExtractor={item => item.id}
        contentContainerStyle={[
          styles.content,
          isTablet && styles.contentTablet,
          sessions.length === 0 && styles.contentEmpty,
        ]}
        ListHeaderComponent={
          <View style={styles.heroCard}>
            <Text style={styles.heroEyebrow}>History</Text>
            <Text style={styles.heroTitle}>Recent extraction sessions</Text>
            <Text style={styles.heroSubtitle}>
              Reopen previous scans and jump straight back into the Home tab with the
              selected source and results restored.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptyText}>
              Completed scans will appear here so you can reopen them later.
            </Text>
          </View>
        }
        renderItem={({item}) => (
          <Pressable
            onPress={() => onSelectSession(item)}
            style={({pressed}) => [styles.sessionCard, pressed && styles.sessionCardPressed]}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionTitle}>{item.inputLabel}</Text>
              <View style={styles.sourceBadge}>
                <Text style={styles.sourceBadgeText}>{sourceLabel(item.source)}</Text>
              </View>
            </View>
            <Text style={styles.sessionMeta}>
              {item.emails.length} emails extracted
            </Text>
            <Text style={styles.sessionTime}>{formatSessionDate(item.createdAt)}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F5F9',
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 28,
  },
  contentTablet: {
    width: '100%',
    maxWidth: 860,
    alignSelf: 'center',
    paddingHorizontal: 28,
  },
  contentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  heroCard: {
    backgroundColor: '#132238',
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingVertical: 22,
    marginBottom: 18,
    ...CARD_SHADOW,
  },
  heroEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    color: 'rgba(223, 235, 249, 0.74)',
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -1,
    color: '#F7FBFF',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(227, 237, 249, 0.8)',
  },
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E1EAF4',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    ...CARD_SHADOW,
  },
  sessionCardPressed: {
    backgroundColor: '#F6FAFF',
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 8,
  },
  sessionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#132238',
  },
  sourceBadge: {
    borderRadius: 999,
    backgroundColor: '#E7F0FA',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sourceBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D5F9D',
    textTransform: 'uppercase',
  },
  sessionMeta: {
    fontSize: 14,
    color: '#51657C',
    marginBottom: 6,
  },
  sessionTime: {
    fontSize: 12,
    color: '#72859A',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E1EAF4',
    paddingHorizontal: 22,
    paddingVertical: 28,
    alignItems: 'center',
    ...CARD_SHADOW,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#132238',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: '#617388',
  },
});
