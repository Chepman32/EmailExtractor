import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

type SettingsScreenProps = {
  historyCount: number;
  onClearHistory: () => Promise<void>;
  onResetHome: () => void;
};

const CARD_SHADOW = {
  shadowColor: '#0C2340',
  shadowOpacity: 0.08,
  shadowRadius: 18,
  shadowOffset: {width: 0, height: 10},
  elevation: 4,
};

export function SettingsScreen({
  historyCount,
  onClearHistory,
  onResetHome,
}: SettingsScreenProps) {
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResetHome = () => {
    onResetHome();
    setErrorMessage(null);
    setMessage('Home screen reset. Current draft and results were cleared.');
  };

  const handleClearHistory = async () => {
    setIsClearing(true);
    setMessage(null);
    setErrorMessage(null);

    try {
      await onClearHistory();
      setMessage('Saved history cleared.');
    } catch {
      setErrorMessage('Unable to clear saved history.');
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Settings</Text>
          <Text style={styles.heroTitle}>Keep the app tidy</Text>
          <Text style={styles.heroSubtitle}>
            Manage your saved sessions and reset the Home workspace without losing the
            cleaner navigation flow.
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Saved history entries</Text>
          <Text style={styles.metricValue}>{historyCount}</Text>
          <Text style={styles.metricHint}>
            Use History to reopen earlier scans. Clear the list here when you want a
            clean slate.
          </Text>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>Reset Home screen</Text>
          <Text style={styles.actionSubtitle}>
            Clear the current source, draft text, extracted results, and inline errors.
          </Text>
          <Pressable
            onPress={handleResetHome}
            testID="reset-home-button"
            style={({pressed}) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}>
            <Text style={styles.primaryButtonText}>Reset Home</Text>
          </Pressable>
        </View>

        <View style={styles.actionCard}>
          <Text style={styles.actionTitle}>Clear saved history</Text>
          <Text style={styles.actionSubtitle}>
            Remove every stored extraction session from this device.
          </Text>
          <Pressable
            disabled={isClearing}
            onPress={() => {
              handleClearHistory().catch(() => {
                setErrorMessage('Unable to clear saved history.');
              });
            }}
            testID="clear-history-settings-button"
            style={({pressed}) => [
              styles.secondaryButton,
              isClearing && styles.secondaryButtonDisabled,
              pressed && !isClearing && styles.secondaryButtonPressed,
            ]}>
            {isClearing ? (
              <ActivityIndicator color="#B04B4B" />
            ) : (
              <Text style={styles.secondaryButtonText}>Clear History</Text>
            )}
          </Pressable>
        </View>

        {message ? <Text style={styles.successText}>{message}</Text> : null}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F5F9',
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 28,
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
  metricCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E1EAF4',
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 14,
    ...CARD_SHADOW,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: '#5F7896',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 34,
    fontWeight: '800',
    color: '#132238',
    marginBottom: 8,
  },
  metricHint: {
    fontSize: 14,
    lineHeight: 21,
    color: '#617388',
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E1EAF4',
    paddingHorizontal: 18,
    paddingVertical: 18,
    marginBottom: 14,
    ...CARD_SHADOW,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#132238',
    marginBottom: 6,
  },
  actionSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: '#617388',
    marginBottom: 16,
  },
  primaryButton: {
    borderRadius: 18,
    backgroundColor: '#1D73CC',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonPressed: {
    backgroundColor: '#165FA9',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    borderRadius: 18,
    backgroundColor: '#FFF1F1',
    borderWidth: 1,
    borderColor: '#F5CACA',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 50,
    justifyContent: 'center',
  },
  secondaryButtonPressed: {
    backgroundColor: '#F9E1E1',
  },
  secondaryButtonDisabled: {
    opacity: 0.75,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#B04B4B',
  },
  successText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#1E7A4E',
  },
  errorText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#B04B4B',
  },
});
