import React, {useEffect, useMemo, useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useI18n} from '../../localization/i18n';
import {
  EXTRACTABLE_DATA_TYPES,
} from '../../shared/extractedData';
import {readHistory} from '../../domain/history/historyStorage';
import {HistorySession} from '../../shared/types';
import {AppTheme, createShadow, themes} from '../../theme/themes';

type HistoryScreenProps = {
  isActive: boolean;
  onSelectSession: (session: HistorySession) => void;
  theme?: AppTheme;
};

function buildSessionSummary(
  session: HistorySession,
  formatCount: (type: (typeof EXTRACTABLE_DATA_TYPES)[number], count: number) => string,
  emptyLabel: string,
): string {
  const summary = EXTRACTABLE_DATA_TYPES.flatMap(type => {
    const count = session.matches[type].length;
    return count > 0 ? [formatCount(type, count)] : [];
  });

  return summary.join(' • ') || emptyLabel;
}

export function HistoryScreen({
  isActive,
  onSelectSession,
  theme = themes.light,
}: HistoryScreenProps) {
  const i18n = useI18n();
  const {width} = useWindowDimensions();
  const isTablet = width >= 768;
  const [sessions, setSessions] = useState<HistorySession[]>([]);
  const styles = useMemo(() => createStyles(theme), [theme]);

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
            <Text style={styles.heroEyebrow}>{i18n.strings.history.heroEyebrow}</Text>
            <Text style={styles.heroTitle}>{i18n.strings.history.heroTitle}</Text>
            <Text style={styles.heroSubtitle}>
              {i18n.t(i18n.strings.history.heroSubtitle, {
                homeTabLabel: i18n.strings.tabs.home,
              })}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>{i18n.strings.history.emptyTitle}</Text>
            <Text style={styles.emptyText}>{i18n.strings.history.emptyText}</Text>
          </View>
        }
        renderItem={({item}) => (
          <Pressable
            onPress={() => onSelectSession(item)}
            style={({pressed}) => [styles.sessionCard, pressed && styles.sessionCardPressed]}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionTitle}>{item.inputLabel}</Text>
              <View style={styles.sourceBadge}>
                <Text style={styles.sourceBadgeText}>{i18n.sourceLabel(item.source)}</Text>
              </View>
            </View>
            <Text style={styles.sessionMeta}>
              {buildSessionSummary(item, i18n.formatCount, i18n.strings.history.noResultsStored)}
            </Text>
            <Text style={styles.sessionTime}>{i18n.formatHistoryDate(item.createdAt)}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.appBackground,
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
      backgroundColor: theme.colors.heroBackground,
      borderRadius: 30,
      paddingHorizontal: 22,
      paddingVertical: 22,
      marginBottom: 18,
      ...createShadow(theme.colors.shadow, 0.08, 18, 10, 4),
    },
    heroEyebrow: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1.1,
      textTransform: 'uppercase',
      color: theme.colors.heroTextSecondary,
      marginBottom: 10,
    },
    heroTitle: {
      fontSize: 30,
      fontWeight: '800',
      letterSpacing: -1,
      color: theme.colors.heroTextPrimary,
      marginBottom: 10,
    },
    heroSubtitle: {
      fontSize: 14,
      lineHeight: 21,
      color: theme.colors.heroTextSecondary,
    },
    sessionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 16,
      paddingVertical: 16,
      marginBottom: 12,
      ...createShadow(theme.colors.shadow, 0.08, 18, 10, 4),
    },
    sessionCardPressed: {
      backgroundColor: theme.colors.surfacePressed,
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
      color: theme.colors.textPrimary,
    },
    sourceBadge: {
      borderRadius: 999,
      backgroundColor: theme.colors.primarySoft,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    sourceBadgeText: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.colors.primarySoftText,
      textTransform: 'uppercase',
    },
    sessionMeta: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 6,
    },
    sessionTime: {
      fontSize: 12,
      color: theme.colors.textMuted,
    },
    emptyCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 22,
      paddingVertical: 28,
      alignItems: 'center',
      ...createShadow(theme.colors.shadow, 0.08, 18, 10, 4),
    },
    emptyTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.colors.textPrimary,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 14,
      lineHeight: 21,
      textAlign: 'center',
      color: theme.colors.textSecondary,
    },
  });
}
