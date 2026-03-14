import React, {useEffect, useMemo, useState} from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {SafeAreaView} from 'react-native-safe-area-context';

import {
  addSessionToHistory,
  clearHistory,
  createHistorySession,
} from '../../domain/history/historyStore';
import {
  clearPersistedHistory,
  persistHistory,
  readHistory,
} from '../../domain/history/historyStorage';
import {ExtractionResult, HistorySession} from '../../shared/types';
import {exportEmails} from '../../native/emailExtractionBridge';
import {extractEmails} from './extractionEngine';
import {pickFromCamera, pickFromFiles, pickFromPhotoLibrary} from './sourcePickers';
import {SelectedAsset} from './types';

const SOURCE_ITEMS = [
  {id: 'text', label: 'Text'},
  {id: 'camera', label: 'Camera'},
  {id: 'photos', label: 'Photos'},
  {id: 'files', label: 'Files'},
] as const;

type SourceId = (typeof SOURCE_ITEMS)[number]['id'];

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

export function ExtractorScreen() {
  const {width} = useWindowDimensions();
  const isTablet = width >= 768;

  const [source, setSource] = useState<SourceId>('text');
  const [text, setText] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<SelectedAsset | null>(null);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [history, setHistory] = useState<HistorySession[]>([]);
  const [historyVisible, setHistoryVisible] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      const sessions = await readHistory();
      setHistory(sessions);
    };

    loadHistory().catch(() => {
      setHistory([]);
    });
  }, []);

  const canExtract = useMemo(() => {
    if (source === 'text') {
      return text.trim().length > 0;
    }

    return Boolean(selectedAsset?.uri);
  }, [source, text, selectedAsset]);

  const extractButtonTitle = isExtracting ? 'Extracting...' : 'Extract Emails';

  const handleSourcePress = async (nextSource: SourceId) => {
    setErrorMessage(null);
    setResult(null);

    if (nextSource === 'text') {
      setSource('text');
      setSelectedAsset(null);
      return;
    }

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

      setSource(nextSource);
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
      const session = createHistorySession(
        source,
        extraction.emails,
        buildInputLabel(source, text, selectedAsset),
      );
      const nextHistory = addSessionToHistory(history, session);

      setHistory(nextHistory);
      await persistHistory(nextHistory);
    } catch {
      setErrorMessage('Emails were extracted, but history could not be saved.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleClearAll = () => {
    setText('');
    setSelectedAsset(null);
    setResult(null);
    setErrorMessage(null);
    setSource('text');
  };

  const handleCopy = () => {
    const emails = result?.emails ?? [];

    if (emails.length === 0) {
      return;
    }

    Clipboard.setString(emails.join('\n'));
    Alert.alert('Copied', 'Emails copied to clipboard.');
  };

  const handleShare = async () => {
    const emails = result?.emails ?? [];

    if (emails.length === 0) {
      return;
    }

    await Share.share({message: emails.join('\n')});
  };

  const handleExport = async (format: 'txt' | 'csv') => {
    const emails = result?.emails ?? [];

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

  const handleClearHistory = async () => {
    const next = clearHistory(history);
    setHistory(next);
    await clearPersistedHistory();
  };

  const handleHistoryPick = (session: HistorySession) => {
    setResult(mapSessionToResult(session));
    setSource(session.source as SourceId);
    setText(session.inputLabel);
    setSelectedAsset(createHistoryAssetLabel(session));
    setHistoryVisible(false);
  };

  const emails = result?.emails ?? [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.select({ios: 'padding', default: undefined})}
        style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.screen, isTablet && styles.screenTablet]}>
            <View style={styles.headerRow}>
              <Text style={styles.title} testID="screen-title">
                Email Extractor
              </Text>
              <View style={styles.headerActions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setHistoryVisible(true)}
                  testID="history-button"
                  style={styles.iconButton}>
                  <Text style={styles.iconButtonText}>🕘</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={handleClearAll}
                  testID="clear-button"
                  style={styles.iconButton}>
                  <Text style={styles.iconButtonText}>🗑</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.sourceRow}>
              {SOURCE_ITEMS.map(item => (
                <Pressable
                  key={item.id}
                  onPress={() => {
                    handleSourcePress(item.id).catch(() => {
                      setErrorMessage('Unable to import source. Please try again.');
                    });
                  }}
                  testID={`source-${item.id}`}
                  style={[
                    styles.sourceButton,
                    source === item.id && styles.sourceButtonActive,
                  ]}>
                  <Text
                    style={[
                      styles.sourceButtonText,
                      source === item.id && styles.sourceButtonTextActive,
                    ]}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.inputBox}>
              {source === 'text' ? (
                <TextInput
                  multiline
                  placeholder="Paste text to scan for email addresses"
                  placeholderTextColor="#A5A5A5"
                  style={styles.textInput}
                  value={text}
                  onChangeText={setText}
                />
              ) : (
                <Text style={styles.assetLabel}>
                  {selectedAsset?.name || selectedAsset?.uri || 'No source selected'}
                </Text>
              )}
            </View>

            <Pressable
              testID="extract-button"
              disabled={!canExtract || isExtracting}
              onPress={() => {
                handleExtract().catch(() => {
                  setErrorMessage('Extraction failed. Please verify permissions and file format.');
                });
              }}
              style={[
                styles.extractButton,
                (!canExtract || isExtracting) && styles.extractButtonDisabled,
              ]}>
              <Text style={styles.extractButtonText}>{extractButtonTitle}</Text>
            </Pressable>

            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            {result?.warnings.length ? (
              <View style={styles.warningBox}>
                {result.warnings.map(warning => (
                  <Text key={warning} style={styles.warningText}>
                    {warning}
                  </Text>
                ))}
              </View>
            ) : null}

            {emails.length > 0 ? (
              <>
                <View style={styles.actionsRow}>
                  <Pressable onPress={handleCopy} style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Copy</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      handleShare().catch(() => {
                        setErrorMessage('Unable to share extracted emails.');
                      });
                    }}
                    style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Share</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      handleExport('txt').catch(() => {
                        setErrorMessage('Unable to export TXT file.');
                      });
                    }}
                    style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Export TXT</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      handleExport('csv').catch(() => {
                        setErrorMessage('Unable to export CSV file.');
                      });
                    }}
                    style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Export CSV</Text>
                  </Pressable>
                </View>

                <FlatList
                  data={emails}
                  keyExtractor={item => item}
                  contentContainerStyle={styles.resultList}
                  renderItem={({item}) => (
                    <Text style={styles.resultItem} testID="result-email">
                      {item}
                    </Text>
                  )}
                />
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No emails found</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal
        visible={historyVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setHistoryVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setHistoryVisible(false)}>
          <Pressable style={styles.historySheet} onPress={() => {}}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Recent Sessions</Text>
              <Pressable onPress={() => setHistoryVisible(false)}>
                <Text style={styles.historyClose}>Close</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                handleClearHistory().catch(() => {
                  setErrorMessage('Unable to clear history.');
                });
              }}
              testID="clear-history-button"
              style={styles.clearHistoryButton}>
              <Text style={styles.clearHistoryText}>Clear history</Text>
            </Pressable>

            <FlatList
              data={history}
              keyExtractor={item => item.id}
              ListEmptyComponent={<Text style={styles.emptyHistory}>No recent sessions yet.</Text>}
              renderItem={({item}) => (
                <Pressable
                  onPress={() => handleHistoryPick(item)}
                  style={styles.historyRow}>
                  <Text style={styles.historyRowTitle}>{item.inputLabel}</Text>
                  <Text style={styles.historyRowSubtitle}>
                    {item.emails.length} emails • {item.source}
                  </Text>
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 24,
  },
  screenTablet: {
    width: '100%',
    maxWidth: 760,
    alignSelf: 'center',
    paddingHorizontal: 28,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    letterSpacing: -0.8,
    color: '#101010',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonText: {
    fontSize: 18,
  },
  sourceRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  sourceButton: {
    flex: 1,
    backgroundColor: '#EFF2F5',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFF2F5',
  },
  sourceButtonActive: {
    borderColor: '#5EA3E3',
    backgroundColor: '#F5FAFF',
  },
  sourceButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  sourceButtonTextActive: {
    color: '#3C86CB',
  },
  inputBox: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 12,
    minHeight: 180,
    padding: 12,
    justifyContent: 'center',
    marginBottom: 12,
  },
  textInput: {
    minHeight: 156,
    fontSize: 16,
    color: '#111111',
    textAlignVertical: 'top',
  },
  assetLabel: {
    fontSize: 14,
    color: '#525252',
  },
  extractButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#4FA0EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  extractButtonDisabled: {
    backgroundColor: '#E6E8EB',
  },
  extractButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  errorText: {
    color: '#B23A3A',
    fontSize: 13,
    marginBottom: 8,
  },
  warningBox: {
    backgroundColor: '#FFF6E5',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  warningText: {
    color: '#885C00',
    fontSize: 13,
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  actionButton: {
    backgroundColor: '#EEF4FC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  actionButtonText: {
    color: '#2B6FB3',
    fontSize: 12,
    fontWeight: '700',
  },
  resultList: {
    paddingBottom: 18,
  },
  resultItem: {
    fontSize: 14,
    color: '#1E1E1E',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DFDFDF',
  },
  emptyContainer: {
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 22,
    color: '#8A8A8A',
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  historySheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '70%',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
  },
  historyClose: {
    fontSize: 14,
    color: '#2F80D1',
    fontWeight: '600',
  },
  clearHistoryButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  clearHistoryText: {
    color: '#B23A3A',
    fontSize: 13,
    fontWeight: '600',
  },
  historyRow: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#DCDCDC',
  },
  historyRowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  historyRowSubtitle: {
    fontSize: 12,
    color: '#6A6A6A',
  },
  emptyHistory: {
    fontSize: 14,
    color: '#6A6A6A',
    textAlign: 'center',
    paddingVertical: 24,
  },
});
