import React, {
  forwardRef,
  useRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Share,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  addSessionToHistory,
  createHistorySession,
} from '../../domain/history/historyStore';
import {persistHistory, readHistory} from '../../domain/history/historyStorage';
import {ExtractionResult, HistorySession} from '../../shared/types';
import {exportEmails} from '../../native/emailExtractionBridge';
import {extractEmails} from './extractionEngine';
import {pickFromCamera, pickFromFiles, pickFromPhotoLibrary} from './sourcePickers';
import {SelectedAsset} from './types';
import {AppTheme, createShadow, themes} from '../../theme/themes';

const SOURCE_ITEMS = [
  {
    id: 'text',
    label: 'Text',
    description: 'Paste copied content',
    badge: 'Aa',
  },
  {
    id: 'camera',
    label: 'Camera',
    description: 'Capture on the spot',
    badge: 'C',
  },
  {
    id: 'photos',
    label: 'Photos',
    description: 'Pick from library',
    badge: 'P',
  },
  {
    id: 'files',
    label: 'Files',
    description: 'Import a document',
    badge: 'F',
  },
] as const;

const SOURCE_ROWS = [SOURCE_ITEMS.slice(0, 2), SOURCE_ITEMS.slice(2)] as const;

type SourceId = (typeof SOURCE_ITEMS)[number]['id'];

type ExtractorScreenProps = {
  onHistoryChanged?: (count: number) => void;
  theme?: AppTheme;
};

export type ExtractorScreenHandle = {
  loadSession: (session: HistorySession) => void;
  resetAll: () => void;
};

function buildInputLabel(source: SourceId, text: string, asset: SelectedAsset | null): string {
  if (source === 'text') {
    return text.trim().slice(0, 64) || 'Manual text';
  }

  return asset?.name?.trim() || 'Imported source';
}

function mapSessionToResult(session: HistorySession): ExtractionResult {
  return {
    emails: session.emails,
    source: session.source,
    rawTextLength: 0,
    extractedAt: session.createdAt,
    warnings: [],
  };
}

function createHistoryAssetLabel(session: HistorySession): SelectedAsset | null {
  if (session.source === 'text') {
    return null;
  }

  return {
    uri: session.inputLabel,
    name: session.inputLabel,
  };
}

function findSourceItem(source: string) {
  return SOURCE_ITEMS.find(item => item.id === source) ?? SOURCE_ITEMS[0];
}

function getSourceHelperText(
  source: SourceId,
  sourceLabel: string,
  selectedAsset: SelectedAsset | null,
) {
  if (source === 'text') {
    return 'Paste any copied thread, note, or document text and the app will pull out unique email addresses.';
  }

  if (selectedAsset?.uri) {
    return 'Source attached and ready to scan. Tap the same option again to replace it.';
  }

  return `Choose a ${sourceLabel.toLowerCase()} source to continue.`;
}

export const ExtractorScreen = forwardRef<
  ExtractorScreenHandle,
  ExtractorScreenProps
>(function ExtractorScreen(
  {onHistoryChanged, theme = themes.light},
  ref,
) {
  const {width} = useWindowDimensions();
  const isTablet = width >= 768;

  const [source, setSource] = useState<SourceId>('text');
  const [text, setText] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<SelectedAsset | null>(null);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const canExtract = useMemo(() => {
    if (source === 'text') {
      return text.trim().length > 0;
    }

    return Boolean(selectedAsset?.uri);
  }, [source, text, selectedAsset]);

  const activeSource = findSourceItem(source);
  const emails = result?.emails ?? [];
  const extractButtonTitle = isExtracting ? 'Extracting...' : 'Extract Emails';
  const readyStateLabel = canExtract
    ? 'Ready'
    : source === 'text'
      ? 'Awaiting text'
      : 'Awaiting import';
  const statusIconName = source === 'text' ? 'content-paste' : 'tray-arrow-down';
  const extractButtonHint = canExtract
    ? 'Extract unique addresses from the current input.'
    : source === 'text'
      ? 'Paste some text to enable extraction.'
      : `Import a ${activeSource.label.toLowerCase()} source to enable extraction.`;
  const sourceHelperText = getSourceHelperText(source, activeSource.label, selectedAsset);
  const screenContentStyle = [
    styles.scrollContent,
    styles.screen,
    isTablet && styles.screenTablet,
  ];

  const handleClearAll = () => {
    setText('');
    setSelectedAsset(null);
    setResult(null);
    setErrorMessage(null);
    setSource('text');
  };

  const handleLoadSession = (session: HistorySession) => {
    setResult(mapSessionToResult(session));
    setSource(session.source as SourceId);
    setText(session.inputLabel);
    setSelectedAsset(createHistoryAssetLabel(session));
    setErrorMessage(null);
  };

  useImperativeHandle(
    ref,
    () => ({
      loadSession: handleLoadSession,
      resetAll: handleClearAll,
    }),
    [],
  );

  const handleSourcePress = async (nextSource: SourceId) => {
    setErrorMessage(null);
    setResult(null);

    if (nextSource === 'text') {
      setSource('text');
      setSelectedAsset(null);
      return;
    }

    setSource(nextSource);
    setSelectedAsset(null);

    try {
      const picker =
        nextSource === 'camera'
          ? pickFromCamera
          : nextSource === 'photos'
            ? pickFromPhotoLibrary
            : pickFromFiles;
      const asset = await picker();

      if (!asset?.uri) {
        return;
      }

      setSelectedAsset(asset);
    } catch {
      setErrorMessage('Unable to import source. Please try again.');
    }
  };

  const handleExtract = async () => {
    if (!canExtract || isExtracting) {
      return;
    }

    setErrorMessage(null);
    setIsExtracting(true);
    let extraction: ExtractionResult | null = null;

    try {
      extraction = await extractEmails({
        source,
        text,
        selectedAsset,
      });

      setResult(extraction);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown extraction error';
      setErrorMessage(`Extraction failed: ${message}`);
      setResult(null);
      setIsExtracting(false);
      return;
    }

    if (!extraction) {
      setIsExtracting(false);
      return;
    }

    try {
      const existingHistory = await readHistory();
      const session = createHistorySession(
        source,
        extraction.emails,
        buildInputLabel(source, text, selectedAsset),
      );
      const nextHistory = addSessionToHistory(existingHistory, session);

      await persistHistory(nextHistory);
      onHistoryChanged?.(nextHistory.length);
    } catch {
      setErrorMessage('Emails were extracted, but history could not be saved.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handlePasteFromClipboard = async () => {
    if (source !== 'text') {
      return;
    }

    try {
      const clipboardText = await Clipboard.getString();

      if (!clipboardText.trim()) {
        setErrorMessage('Clipboard is empty.');
        return;
      }

      setErrorMessage(null);
      setResult(null);
      setText(clipboardText);
      textInputRef.current?.focus();
    } catch {
      setErrorMessage('Unable to paste from clipboard.');
    }
  };

  const handleCopy = () => {
    if (emails.length === 0) {
      return;
    }

    Clipboard.setString(emails.join('\n'));
    Alert.alert('Copied', 'Emails copied to clipboard.');
  };

  const handleCopyEmail = (email: string) => {
    Clipboard.setString(email);
    Alert.alert('Copied', `${email} copied to clipboard.`);
  };

  const handleShare = async () => {
    if (emails.length === 0) {
      return;
    }

    await Share.share({message: emails.join('\n')});
  };

  const handleExport = async (format: 'txt' | 'csv') => {
    if (emails.length === 0) {
      return;
    }

    try {
      const exported = await exportEmails(emails, format);
      await Share.share({
        url: exported.fileUri,
        message: `Exported ${emails.length} emails as ${format.toUpperCase()}.`,
      });
    } catch {
      setErrorMessage(`Unable to export ${format.toUpperCase()} file.`);
    }
  };

  const renderEmailItem = ({item}: {item: string}) => (
    <Pressable
      accessibilityRole="button"
      onPress={() => handleCopyEmail(item)}
      style={({pressed}) => [styles.resultCard, pressed && styles.resultCardPressed]}>
      <View style={styles.resultCardHeader}>
        <View style={styles.resultDot} />
        <Text style={styles.resultMeta}>Tap to copy</Text>
      </View>
      <Text style={styles.resultItem} testID="result-email">
        {item}
      </Text>
    </Pressable>
  );

  const screenHeader = (
    <>
      <View style={styles.heroCard}>
        <View style={styles.heroGlowPrimary} />
        <View style={styles.heroGlowSecondary} />

        <View style={styles.heroSourceGrid}>
          {SOURCE_ROWS.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.heroSourceRow}>
              {row.map(item => (
                <Pressable
                  key={item.id}
                  accessibilityRole="button"
                  onPress={() => {
                    handleSourcePress(item.id).catch(() => {
                      setErrorMessage('Unable to import source. Please try again.');
                    });
                  }}
                  testID={`source-${item.id}`}
                  style={({pressed}) => [
                    styles.sourceButton,
                    styles.heroSourceButton,
                    styles.heroSourceRowItem,
                    source === item.id && styles.sourceButtonActive,
                    pressed && styles.sourceButtonPressed,
                  ]}>
                  <View
                    style={[
                      styles.sourceBadge,
                      source === item.id && styles.sourceBadgeActive,
                    ]}>
                    <Text
                      style={[
                        styles.sourceBadgeText,
                        source === item.id && styles.sourceBadgeTextActive,
                      ]}>
                      {item.badge}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.sourceButtonText,
                      source === item.id && styles.sourceButtonTextActive,
                    ]}>
                    {item.label}
                  </Text>
                  <Text style={styles.sourceButtonDescription}>{item.description}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionHeaderCopy}>
            <Text style={styles.sectionEyebrow}>Input</Text>
            <Text style={styles.sectionTitle} testID="screen-title">
              Email Extractor
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={handleClearAll}
            testID="clear-button"
            style={({pressed}) => [
              styles.resetButton,
              pressed && styles.resetButtonPressed,
            ]}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </Pressable>
        </View>
        <Text style={styles.sectionSubtitle}>
          Select a source above, prepare the content here, and run the scan when it is ready.
        </Text>

        <View style={styles.inputCard}>
          <View style={styles.inputCardHeader}>
            <View style={styles.inputCardCopy}>
              <Text style={styles.inputCardTitle}>
                {source === 'text' ? 'Paste text to scan' : `${activeSource.label} source`}
              </Text>
              <Text style={styles.inputCardSubtitle}>{sourceHelperText}</Text>
            </View>
            <Pressable
              accessibilityLabel={source === 'text' ? 'Paste from clipboard' : readyStateLabel}
              accessibilityRole={source === 'text' ? 'button' : undefined}
              onPress={() => {
                if (source === 'text') {
                  handlePasteFromClipboard().catch(() => {
                    setErrorMessage('Unable to paste from clipboard.');
                  });
                }
              }}
              testID={source === 'text' ? 'paste-button' : 'input-status'}
              style={({pressed}) => [
                styles.statusPill,
                source === 'text' && pressed && styles.statusPillPressed,
              ]}>
              <MaterialCommunityIcons
                color={theme.colors.statusIcon}
                name={statusIconName}
                size={20}
                style={styles.statusPillIcon}
              />
            </Pressable>
          </View>

          {source === 'text' ? (
            <TextInput
              ref={textInputRef}
              multiline
              placeholder="Paste text to scan for email addresses"
              placeholderTextColor={theme.colors.textMuted}
              style={styles.textInput}
              value={text}
              onChangeText={setText}
            />
          ) : (
            <View style={styles.assetCard}>
              <View style={styles.assetBadge}>
                <Text style={styles.assetBadgeText}>{activeSource.badge}</Text>
              </View>
              <View style={styles.assetCopy}>
                <Text style={styles.assetLabel}>
                  {selectedAsset?.name || selectedAsset?.uri || 'No source selected'}
                </Text>
                <Text style={styles.assetHint}>
                  {selectedAsset?.uri
                    ? 'Tap the same source option above to replace this file.'
                    : `Select a ${activeSource.label.toLowerCase()} source to continue.`}
                </Text>
              </View>
            </View>
          )}
        </View>

        <Pressable
          testID="extract-button"
          disabled={!canExtract || isExtracting}
          onPress={() => {
            handleExtract().catch((err: unknown) => {
              const msg = err instanceof Error ? err.message : 'Unknown error';
              setErrorMessage(`Extraction failed: ${msg}`);
            });
          }}
          style={({pressed}) => [
            styles.extractButton,
            (!canExtract || isExtracting) && styles.extractButtonDisabled,
            pressed && canExtract && !isExtracting && styles.extractButtonPressed,
          ]}>
          <View style={styles.extractButtonCopy}>
            <Text style={styles.extractButtonText}>{extractButtonTitle}</Text>
            <Text style={styles.extractButtonCaption}>{extractButtonHint}</Text>
          </View>
          {isExtracting ? (
            <ActivityIndicator color={theme.colors.primaryOn} />
          ) : (
            <View style={styles.extractButtonArrow}>
              <Text style={styles.extractButtonArrowText}>→</Text>
            </View>
          )}
        </Pressable>

        {errorMessage ? (
          <View style={[styles.messageCard, styles.errorCard]}>
            <Text style={styles.messageEyebrow}>Issue</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {result?.warnings.length ? (
          <View style={[styles.messageCard, styles.warningCard]}>
            <Text style={styles.messageEyebrow}>Warnings</Text>
            {result.warnings.map(warning => (
              <Text key={warning} style={styles.warningText}>
                {warning}
              </Text>
            ))}
          </View>
        ) : null}
      </View>

      <View style={styles.resultsPanel}>
        <View style={styles.resultsHeader}>
          <View style={styles.resultsCopy}>
            <Text style={styles.sectionEyebrow}>Results</Text>
            <Text style={styles.sectionTitle}>Extracted emails</Text>
            <Text style={styles.sectionSubtitle}>
              {emails.length > 0
                ? 'Tap any result to copy it instantly, or use the quick actions.'
                : 'Your extracted addresses will appear here once you run a scan.'}
            </Text>
          </View>
          <View
            style={[
              styles.resultCountBadge,
              emails.length === 0 && styles.resultCountBadgeEmpty,
            ]}>
            <Text style={styles.resultCountValue}>{emails.length}</Text>
            <Text style={styles.resultCountLabel}>found</Text>
          </View>
        </View>

        {emails.length > 0 ? (
          <View style={styles.actionsRow}>
            <Pressable
              onPress={handleCopy}
              style={({pressed}) => [styles.actionButton, pressed && styles.actionButtonPressed]}>
              <Text style={styles.actionButtonText}>Copy</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                handleShare().catch(() => {
                  setErrorMessage('Unable to share extracted emails.');
                });
              }}
              style={({pressed}) => [styles.actionButton, pressed && styles.actionButtonPressed]}>
              <Text style={styles.actionButtonText}>Share</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                handleExport('txt').catch(() => {
                  setErrorMessage('Unable to export TXT file.');
                });
              }}
              style={({pressed}) => [styles.actionButton, pressed && styles.actionButtonPressed]}>
              <Text style={styles.actionButtonText}>Export TXT</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                handleExport('csv').catch(() => {
                  setErrorMessage('Unable to export CSV file.');
                });
              }}
              style={({pressed}) => [styles.actionButton, pressed && styles.actionButtonPressed]}>
              <Text style={styles.actionButtonText}>Export CSV</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </>
  );

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.select({ios: 'padding', default: undefined})}
        style={styles.flex}>
        <FlatList
          data={emails}
          keyExtractor={(item, index) => `${item}-${index}`}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={screenContentStyle}
          ListHeaderComponent={screenHeader}
          ListEmptyComponent={
            <View style={styles.emptyStateCard}>
              <Text style={styles.emptyEyebrow}>Ready when you are</Text>
              <Text style={styles.emptyText}>No emails found</Text>
              <Text style={styles.emptySubtext}>
                Paste text or import a source, then run extraction to populate this list.
              </Text>
            </View>
          }
          renderItem={renderEmailItem}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.appBackground,
    },
    flex: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
    },
    screen: {
      flexGrow: 1,
      paddingHorizontal: 18,
      paddingTop: 8,
      paddingBottom: 28,
    },
    screenTablet: {
      width: '100%',
      maxWidth: 860,
      alignSelf: 'center',
      paddingHorizontal: 28,
    },
    heroCard: {
      backgroundColor: theme.colors.heroBackground,
      borderRadius: 30,
      paddingHorizontal: 22,
      paddingTop: 22,
      paddingBottom: 20,
      overflow: 'hidden',
      marginBottom: 18,
      ...createShadow(theme.colors.shadow, 0.08, 18, 10, 4),
    },
    heroSourceGrid: {
      gap: 10,
    },
    heroSourceRow: {
      flexDirection: 'row',
      gap: 10,
    },
    heroSourceRowItem: {
      flex: 1,
    },
    heroGlowPrimary: {
      position: 'absolute',
      top: -40,
      right: -10,
      width: 170,
      height: 170,
      borderRadius: 85,
      backgroundColor: theme.colors.heroGlowPrimary,
    },
    heroGlowSecondary: {
      position: 'absolute',
      bottom: -58,
      left: -24,
      width: 150,
      height: 150,
      borderRadius: 75,
      backgroundColor: theme.colors.heroGlowSecondary,
    },
    sectionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 28,
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 18,
      marginBottom: 18,
      ...createShadow(theme.colors.shadow, 0.08, 18, 10, 4),
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 6,
    },
    sectionHeaderCopy: {
      flex: 1,
    },
    sectionEyebrow: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: theme.colors.textMuted,
      marginBottom: 6,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '800',
      letterSpacing: -0.7,
      color: theme.colors.textPrimary,
      marginBottom: 6,
    },
    sectionSubtitle: {
      fontSize: 14,
      lineHeight: 21,
      color: theme.colors.textSecondary,
    },
    sourceButton: {
      borderRadius: 22,
      backgroundColor: theme.colors.surfaceMuted,
      paddingHorizontal: 14,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...createShadow(theme.colors.shadow, 0.05, 12, 6, 2),
    },
    heroSourceButton: {
      minHeight: 144,
      backgroundColor: theme.colors.heroSurface,
      borderColor: theme.colors.heroSurfaceBorder,
    },
    sourceButtonActive: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.pickerRing,
    },
    sourceButtonPressed: {
      transform: [{scale: 0.99}],
    },
    sourceBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.colors.badgeBackground,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
    },
    sourceBadgeActive: {
      backgroundColor: theme.colors.badgeActiveBackground,
    },
    sourceBadgeText: {
      fontSize: 13,
      fontWeight: '800',
      color: theme.colors.badgeText,
    },
    sourceBadgeTextActive: {
      color: theme.colors.badgeActiveText,
    },
    sourceButtonText: {
      fontSize: 17,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 6,
    },
    sourceButtonTextActive: {
      color: theme.colors.primarySoftText,
    },
    sourceButtonDescription: {
      fontSize: 13,
      lineHeight: 19,
      color: theme.colors.textSecondary,
    },
    resetButton: {
      borderRadius: 999,
      backgroundColor: theme.colors.primarySoft,
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    resetButtonPressed: {
      backgroundColor: theme.colors.primarySoftPressed,
    },
    resetButtonText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.colors.primarySoftText,
    },
    inputCard: {
      backgroundColor: theme.colors.inputBackground,
      borderRadius: 24,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 16,
    },
    inputCardHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 14,
    },
    inputCardCopy: {
      flex: 1,
    },
    inputCardTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 4,
    },
    inputCardSubtitle: {
      fontSize: 13,
      lineHeight: 19,
      color: theme.colors.textSecondary,
    },
    statusPill: {
      borderRadius: 999,
      backgroundColor: theme.colors.statusPillBackground,
      minWidth: 44,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    statusPillIcon: {
      textAlign: 'center',
    },
    statusPillPressed: {
      backgroundColor: theme.colors.statusPillPressed,
      transform: [{scale: 0.97}],
    },
    statusPillText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.statusIcon,
    },
    textInput: {
      minHeight: 180,
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.textPrimary,
      textAlignVertical: 'top',
    },
    assetCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      minHeight: 108,
      borderRadius: 20,
      backgroundColor: theme.colors.assetBackground,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    assetBadge: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: theme.colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    assetBadgeText: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.colors.primary,
    },
    assetCopy: {
      flex: 1,
    },
    assetLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: theme.colors.textPrimary,
      marginBottom: 6,
    },
    assetHint: {
      fontSize: 13,
      lineHeight: 19,
      color: theme.colors.textSecondary,
    },
    extractButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: 24,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 18,
      paddingVertical: 16,
      marginBottom: 12,
      ...createShadow(theme.colors.shadow, 0.08, 18, 10, 4),
    },
    extractButtonDisabled: {
      backgroundColor: theme.colors.borderSoft,
    },
    extractButtonPressed: {
      backgroundColor: theme.colors.primaryPressed,
    },
    extractButtonCopy: {
      flex: 1,
      paddingRight: 12,
    },
    extractButtonText: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.colors.primaryOn,
      marginBottom: 4,
    },
    extractButtonCaption: {
      fontSize: 13,
      lineHeight: 19,
      color:
        theme.id === 'dark'
          ? 'rgba(8, 17, 26, 0.72)'
          : theme.id === 'mono'
            ? 'rgba(255, 255, 255, 0.84)'
            : 'rgba(255, 255, 255, 0.82)',
    },
    extractButtonArrow: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        theme.id === 'dark'
          ? 'rgba(8, 17, 26, 0.12)'
          : 'rgba(255, 255, 255, 0.16)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    extractButtonArrowText: {
      fontSize: 20,
      fontWeight: '700',
      color: theme.colors.primaryOn,
    },
    messageCard: {
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 14,
      marginTop: 8,
    },
    errorCard: {
      backgroundColor: theme.colors.dangerBackground,
      borderWidth: 1,
      borderColor: theme.colors.dangerBorder,
    },
    warningCard: {
      backgroundColor: theme.colors.warningBackground,
      borderWidth: 1,
      borderColor: theme.colors.warningBorder,
    },
    messageEyebrow: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: theme.colors.warningText,
      marginBottom: 6,
    },
    errorText: {
      color: theme.colors.dangerText,
      fontSize: 13,
      lineHeight: 19,
    },
    warningText: {
      color: theme.colors.warningText,
      fontSize: 13,
      lineHeight: 19,
    },
    resultsPanel: {
      marginBottom: 14,
    },
    resultsHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 14,
      marginBottom: 14,
    },
    resultsCopy: {
      flex: 1,
    },
    resultCountBadge: {
      width: 70,
      borderRadius: 24,
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      ...createShadow(theme.colors.shadow, 0.05, 12, 6, 2),
    },
    resultCountBadgeEmpty: {
      backgroundColor: theme.colors.badgeBackground,
    },
    resultCountValue: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.colors.primaryOn,
      marginBottom: 2,
    },
    resultCountLabel: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color:
        theme.id === 'dark'
          ? 'rgba(8, 17, 26, 0.72)'
          : 'rgba(255, 255, 255, 0.78)',
    },
    actionsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    actionButton: {
      flexGrow: 1,
      minWidth: 138,
      borderRadius: 18,
      backgroundColor: theme.colors.actionBackground,
      borderWidth: 1,
      borderColor: theme.colors.borderSoft,
      paddingHorizontal: 14,
      paddingVertical: 12,
      alignItems: 'center',
      ...createShadow(theme.colors.shadow, 0.05, 12, 6, 2),
    },
    actionButtonPressed: {
      backgroundColor: theme.colors.actionPressed,
    },
    actionButtonText: {
      color: theme.colors.primarySoftText,
      fontSize: 13,
      fontWeight: '700',
    },
    resultCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginBottom: 10,
      ...createShadow(theme.colors.shadow, 0.08, 18, 10, 4),
    },
    resultCardPressed: {
      backgroundColor: theme.colors.surfacePressed,
    },
    resultCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    resultDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.resultDot,
      marginRight: 8,
    },
    resultMeta: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      color: theme.colors.textMuted,
    },
    resultItem: {
      fontSize: 18,
      lineHeight: 26,
      color: theme.colors.textPrimary,
    },
    emptyStateCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 22,
      paddingVertical: 24,
      alignItems: 'center',
      ...createShadow(theme.colors.shadow, 0.08, 18, 10, 4),
    },
    emptyEyebrow: {
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.9,
      textTransform: 'uppercase',
      color: theme.colors.textMuted,
      marginBottom: 8,
    },
    emptyText: {
      fontSize: 24,
      fontWeight: '800',
      textAlign: 'center',
      color: theme.colors.textPrimary,
      marginBottom: 8,
    },
    emptySubtext: {
      fontSize: 14,
      lineHeight: 21,
      textAlign: 'center',
      color: theme.colors.textSecondary,
      maxWidth: 320,
    },
  });
}
