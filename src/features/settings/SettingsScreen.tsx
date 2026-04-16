import React, {useMemo, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useI18n} from '../../localization/i18n';
import {useLocaleContext} from '../../localization/LocaleContext';
import {SupportedLocale} from '../../localization/translations';
import {
  DataTypeSelection,
  ExtractableDataType,
  hasEnabledDataType,
} from '../../shared/extractedData';
import {AppTheme, createShadow, ThemeId, themeOptions, themes} from '../../theme/themes';

type SettingsScreenProps = {
  dataTypeSelection: DataTypeSelection;
  onDataTypeSelectionChange: (selection: DataTypeSelection) => void;
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

const LANGUAGE_OPTIONS: Array<{locale: SupportedLocale; nativeName: string}> = [
  {locale: 'en', nativeName: 'English'},
  {locale: 'zh-Hans', nativeName: '中文（简体）'},
  {locale: 'ja', nativeName: '日本語'},
  {locale: 'ko', nativeName: '한국어'},
  {locale: 'de', nativeName: 'Deutsch'},
  {locale: 'fr', nativeName: 'Français'},
  {locale: 'es', nativeName: 'Español'},
  {locale: 'pt-BR', nativeName: 'Português (BR)'},
  {locale: 'ru', nativeName: 'Русский'},
];

const dataTypeOptions: Array<{
  icon: string;
  id: ExtractableDataType;
}> = [
  {
    id: 'email',
    icon: 'email-outline',
  },
  {
    id: 'date',
    icon: 'calendar-month-outline',
  },
  {
    id: 'link',
    icon: 'link-variant',
  },
];

export function SettingsScreen({
  dataTypeSelection,
  onDataTypeSelectionChange,
  onThemeChange,
  selectedThemeId,
  theme = themes.light,
}: SettingsScreenProps) {
  const i18n = useI18n();
  const {userLocale, setUserLocale} = useLocaleContext();
  const [statusMessage, setStatusMessage] = useState<{
    kind: 'success' | 'warning';
    text: string;
  } | null>(null);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleThemePress = (nextThemeId: ThemeId) => {
    onThemeChange(nextThemeId);
    setStatusMessage({
      kind: 'success',
      text: i18n.strings.settings.themeUpdated,
    });
  };

  const handleDataTypePress = (nextType: ExtractableDataType) => {
    const nextSelection = {
      ...dataTypeSelection,
      [nextType]: !dataTypeSelection[nextType],
    };

    if (!hasEnabledDataType(nextSelection)) {
      setStatusMessage({
        kind: 'warning',
        text: i18n.strings.settings.selectOneDataType,
      });
      return;
    }

    onDataTypeSelectionChange(nextSelection);
    setStatusMessage({
      kind: 'success',
      text: i18n.strings.settings.preferencesUpdated,
    });
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.themeCard}>
          <Text style={styles.sectionEyebrow}>{i18n.strings.settings.themeEyebrow}</Text>
          <Text style={styles.sectionTitle}>{i18n.strings.settings.themeTitle}</Text>

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
                    {i18n.themeLabel(option.id)}
                  </Text>
                  <Text
                    style={[
                      styles.themeOptionDescription,
                      {color: option.colors.textSecondary},
                    ]}
                    numberOfLines={2}>
                    {i18n.themeDescription(option.id)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.dataTypeCard}>
          <Text style={styles.sectionEyebrow}>{i18n.strings.settings.dataTypesEyebrow}</Text>
          <Text style={styles.sectionTitle}>{i18n.strings.settings.dataTypesTitle}</Text>
          <Text style={styles.sectionSubtitle}>{i18n.strings.settings.dataTypesSubtitle}</Text>

          <View style={styles.dataTypeList}>
            {dataTypeOptions.map(option => {
              const isSelected = dataTypeSelection[option.id];

              return (
                <Pressable
                  key={option.id}
                  onPress={() => handleDataTypePress(option.id)}
                  testID={`data-type-${option.id}`}
                  style={({pressed}) => [
                    styles.dataTypeOption,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.primarySoft
                        : theme.colors.surfaceMuted,
                      borderColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.border,
                    },
                    pressed && styles.dataTypeOptionPressed,
                  ]}>
                  <View style={styles.dataTypeOptionCopy}>
                    <View
                      style={[
                        styles.dataTypeIconWrap,
                        {
                          backgroundColor: isSelected
                            ? theme.colors.primary
                            : theme.colors.surface,
                        },
                      ]}>
                      <MaterialCommunityIcons
                        color={isSelected ? theme.colors.primaryOn : theme.colors.primary}
                        name={option.icon}
                        size={18}
                      />
                    </View>

                    <View style={styles.dataTypeCopy}>
                      <Text
                        style={[
                          styles.dataTypeTitle,
                          {
                            color: isSelected
                              ? theme.colors.primarySoftText
                              : theme.colors.textPrimary,
                          },
                        ]}>
                        {i18n.dataTypeLabel(option.id)}
                      </Text>
                      <Text
                        style={[
                          styles.dataTypeDescription,
                          {color: theme.colors.textSecondary},
                        ]}>
                        {i18n.strings.dataTypes[option.id].settingsDescription}
                      </Text>
                    </View>
                  </View>

                  <MaterialCommunityIcons
                    color={isSelected ? theme.colors.primary : theme.colors.textMuted}
                    name={isSelected ? 'check-circle' : 'circle-outline'}
                    size={20}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.dataTypeCard}>
          <Text style={styles.sectionEyebrow}>{i18n.strings.settings.languageEyebrow}</Text>
          <Text style={styles.sectionTitle}>{i18n.strings.settings.languageTitle}</Text>

          <View style={styles.dataTypeList}>
            <Pressable
              onPress={() => setUserLocale(null)}
              style={({pressed}) => [
                styles.dataTypeOption,
                {
                  backgroundColor:
                    userLocale === null
                      ? theme.colors.primarySoft
                      : theme.colors.surfaceMuted,
                  borderColor:
                    userLocale === null
                      ? theme.colors.primary
                      : theme.colors.border,
                },
                pressed && styles.dataTypeOptionPressed,
              ]}>
              <View style={styles.dataTypeCopy}>
                <Text
                  style={[
                    styles.dataTypeTitle,
                    {
                      color:
                        userLocale === null
                          ? theme.colors.primarySoftText
                          : theme.colors.textPrimary,
                    },
                  ]}>
                  {i18n.strings.settings.deviceLanguage}
                </Text>
              </View>
              <MaterialCommunityIcons
                color={userLocale === null ? theme.colors.primary : theme.colors.textMuted}
                name={userLocale === null ? 'check-circle' : 'circle-outline'}
                size={20}
              />
            </Pressable>

            {LANGUAGE_OPTIONS.map(option => {
              const isSelected = userLocale === option.locale;
              return (
                <Pressable
                  key={option.locale}
                  onPress={() => setUserLocale(option.locale)}
                  style={({pressed}) => [
                    styles.dataTypeOption,
                    {
                      backgroundColor: isSelected
                        ? theme.colors.primarySoft
                        : theme.colors.surfaceMuted,
                      borderColor: isSelected
                        ? theme.colors.primary
                        : theme.colors.border,
                    },
                    pressed && styles.dataTypeOptionPressed,
                  ]}>
                  <View style={styles.dataTypeCopy}>
                    <Text
                      style={[
                        styles.dataTypeTitle,
                        {
                          color: isSelected
                            ? theme.colors.primarySoftText
                            : theme.colors.textPrimary,
                        },
                      ]}>
                      {option.nativeName}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    color={isSelected ? theme.colors.primary : theme.colors.textMuted}
                    name={isSelected ? 'check-circle' : 'circle-outline'}
                    size={20}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        {statusMessage ? (
          <Text
            style={
              statusMessage.kind === 'warning'
                ? styles.warningText
                : styles.successText
            }>
            {statusMessage.text}
          </Text>
        ) : null}
      </ScrollView>
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
      flexGrow: 1,
      paddingHorizontal: 18,
      paddingTop: 8,
      paddingBottom: 28,
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
    dataTypeCard: {
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
    dataTypeList: {
      gap: 10,
    },
    dataTypeOption: {
      borderRadius: 20,
      borderWidth: 1.5,
      paddingHorizontal: 14,
      paddingVertical: 14,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      ...createShadow(theme.colors.shadow, 0.05, 12, 6, 2),
    },
    dataTypeOptionPressed: {
      opacity: 0.95,
    },
    dataTypeOptionCopy: {
      flex: 1,
      flexDirection: 'row',
      gap: 12,
    },
    dataTypeIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
    },
    dataTypeCopy: {
      flex: 1,
    },
    dataTypeTitle: {
      fontSize: 16,
      fontWeight: '700',
      marginBottom: 4,
    },
    dataTypeDescription: {
      fontSize: 13,
      lineHeight: 18,
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
    warningText: {
      fontSize: 13,
      lineHeight: 19,
      color: theme.colors.warningText,
    },
  });
}
