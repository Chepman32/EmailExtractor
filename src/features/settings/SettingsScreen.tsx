import React, {useMemo, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';

import {AppTheme, createShadow, ThemeId, themeOptions, themes} from '../../theme/themes';

type SettingsScreenProps = {
  onThemeChange: (themeId: ThemeId) => void;
  selectedThemeId: ThemeId;
  theme?: AppTheme;
};

const themeIcons: Record<ThemeId, string> = {
  light: 'brightness-7',
  dark: 'weather-night',
  solar: 'white-balance-sunny',
  mono: 'circle-slice-8',
};

export function SettingsScreen({
  onThemeChange,
  selectedThemeId,
  theme = themes.light,
}: SettingsScreenProps) {
  const [message, setMessage] = useState<string | null>(null);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleThemePress = (nextThemeId: ThemeId) => {
    onThemeChange(nextThemeId);
    setMessage(`${themes[nextThemeId].label} theme applied.`);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Settings</Text>
          <Text style={styles.heroTitle}>Adjust the atmosphere</Text>
          <Text style={styles.heroSubtitle}>
            Swap the entire app palette and preview each look before applying it.
          </Text>
        </View>

        <View style={styles.themeCard}>
          <Text style={styles.sectionEyebrow}>Theme</Text>
          <Text style={styles.sectionTitle}>Choose a look</Text>

          <View style={styles.themeGrid}>
            {themeOptions.map(option => {
              const isSelected = option.id === selectedThemeId;

              return (
                <Pressable
                  key={option.id}
                  onPress={() => handleThemePress(option.id)}
                  testID={`theme-${option.id}`}
                  style={({pressed}) => [
                    styles.themeOption,
                    {
                      backgroundColor: option.colors.surface,
                      borderColor: isSelected
                        ? option.colors.primary
                        : option.colors.border,
                    },
                    isSelected && styles.themeOptionSelected,
                    pressed && styles.themeOptionPressed,
                  ]}>
                  <View
                    style={[
                      styles.themePreview,
                      {backgroundColor: option.colors.heroBackground},
                    ]}>
                    <View
                      style={[
                        styles.themePreviewGlow,
                        {backgroundColor: option.colors.heroGlowPrimary},
                      ]}
                    />
                    <View
                      style={[
                        styles.themePreviewCard,
                        {backgroundColor: option.colors.surface},
                      ]}
                    />
                    <View
                      style={[
                        styles.themePreviewAccent,
                        {backgroundColor: option.colors.primary},
                      ]}
                    />
                  </View>
                  <View style={styles.themeOptionHeader}>
                    <MaterialCommunityIcons
                      color={option.colors.primary}
                      name={themeIcons[option.id]}
                      size={18}
                    />
                    {isSelected ? (
                      <MaterialCommunityIcons
                        color={option.colors.primary}
                        name="check-circle"
                        size={18}
                      />
                    ) : null}
                  </View>
                  <Text style={[styles.themeOptionTitle, {color: option.colors.textPrimary}]}>
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.themeOptionDescription,
                      {color: option.colors.textSecondary},
                    ]}
                    numberOfLines={2}>
                    {option.description}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {message ? <Text style={styles.successText}>{message}</Text> : null}
      </View>
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
      flex: 1,
      paddingHorizontal: 18,
      paddingTop: 8,
      paddingBottom: 28,
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
    themeCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 18,
      paddingVertical: 18,
      marginBottom: 14,
      ...createShadow(theme.colors.shadow, 0.08, 18, 10, 4),
    },
    sectionEyebrow: {
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: theme.colors.textMuted,
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.colors.textPrimary,
      marginBottom: 6,
    },
    sectionSubtitle: {
      fontSize: 14,
      lineHeight: 21,
      color: theme.colors.textSecondary,
      marginBottom: 16,
    },
    themeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      justifyContent: 'space-between',
    },
    themeOption: {
      width: '48%',
      borderRadius: 20,
      borderWidth: 1.5,
      padding: 12,
      ...createShadow(theme.colors.shadow, 0.05, 12, 6, 2),
    },
    themeOptionSelected: {
      transform: [{translateY: -1}],
    },
    themeOptionPressed: {
      opacity: 0.94,
    },
    themePreview: {
      height: 58,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: 10,
    },
    themePreviewGlow: {
      position: 'absolute',
      top: -10,
      right: -12,
      width: 56,
      height: 56,
      borderRadius: 28,
    },
    themePreviewCard: {
      position: 'absolute',
      left: 8,
      right: 8,
      bottom: 8,
      top: 14,
      borderRadius: 10,
      opacity: 0.92,
    },
    themePreviewAccent: {
      position: 'absolute',
      left: 8,
      right: 44,
      bottom: 13,
      height: 8,
      borderRadius: 999,
      opacity: 0.8,
    },
    themeOptionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
    },
    themeOptionTitle: {
      fontSize: 15,
      fontWeight: '700',
      marginBottom: 3,
    },
    themeOptionDescription: {
      fontSize: 11,
      lineHeight: 16,
    },
    successText: {
      fontSize: 13,
      lineHeight: 19,
      color: theme.colors.successText,
    },
  });
}
