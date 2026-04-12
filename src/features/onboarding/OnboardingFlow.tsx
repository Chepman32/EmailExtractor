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

import {
  createDefaultDataTypeSelection,
  DATA_TYPE_LABELS,
  DataTypeSelection,
  ExtractableDataType,
  getEnabledDataTypes,
  hasEnabledDataType,
} from '../../shared/extractedData';
import {ExtractionSource} from '../../shared/types';
import {AppTheme, createShadow} from '../../theme/themes';

type OnboardingFlowProps = {
  initialSelection: DataTypeSelection;
  onComplete: (selection: DataTypeSelection) => void;
  theme: AppTheme;
};

const ONBOARDING_STEPS = [
  'welcome',
  'goals',
  'pain',
  'sources',
  'demo',
  'ready',
] as const;

type OnboardingStepId = (typeof ONBOARDING_STEPS)[number];

const GOAL_OPTIONS: Array<{
  description: string;
  icon: string;
  id: ExtractableDataType;
  label: string;
}> = [
  {
    id: 'email',
    label: 'Email addresses',
    description: 'Turn threads and screenshots into a clean contact list.',
    icon: 'email-fast-outline',
  },
  {
    id: 'date',
    label: 'Dates and deadlines',
    description: 'Catch events, due dates, and follow-up moments fast.',
    icon: 'calendar-clock-outline',
  },
  {
    id: 'link',
    label: 'Links and references',
    description: 'Pull buried URLs out of long messages and documents.',
    icon: 'link-variant',
  },
];

const PAIN_POINTS = [
  {
    id: 'retyping',
    label: 'I keep retyping details by hand',
    description: 'The info is already there, but not in a usable format.',
    icon: 'keyboard-outline',
  },
  {
    id: 'buried',
    label: 'Important info gets buried in long threads',
    description: 'I waste time scanning messages just to find one key detail.',
    icon: 'message-text-clock-outline',
  },
  {
    id: 'screenshots',
    label: 'I save screenshots and forget to process them',
    description: 'Useful details sit in my camera roll instead of becoming actions.',
    icon: 'image-search-outline',
  },
  {
    id: 'handoff',
    label: 'I need a clean list I can share fast',
    description: 'I want results I can immediately copy, send, or export.',
    icon: 'send-outline',
  },
] as const;

type PainPointId = (typeof PAIN_POINTS)[number]['id'];

const SOURCE_OPTIONS: Array<{
  description: string;
  icon: string;
  id: ExtractionSource;
  label: string;
}> = [
  {
    id: 'text',
    label: 'Copied text',
    description: 'Threads, notes, copied docs',
    icon: 'content-paste',
  },
  {
    id: 'photos',
    label: 'Screenshots',
    description: 'Images already in your library',
    icon: 'image-outline',
  },
  {
    id: 'files',
    label: 'Files',
    description: 'Docs, PDFs, and imports',
    icon: 'file-document-outline',
  },
  {
    id: 'camera',
    label: 'Live capture',
    description: 'Grab details on the spot',
    icon: 'camera-outline',
  },
];

const SAMPLE_RESULTS: Record<ExtractableDataType, string> = {
  email: 'hello@northstar.studio',
  date: 'April 18, 2026',
  link: 'https://northstar.studio/invite',
};

function formatLabelList(labels: string[]): string {
  if (labels.length <= 1) {
    return labels[0] ?? '';
  }

  if (labels.length === 2) {
    return `${labels[0]} and ${labels[1]}`;
  }

  return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`;
}

function resolveSelection(selection: DataTypeSelection): DataTypeSelection {
  return hasEnabledDataType(selection)
    ? selection
    : createDefaultDataTypeSelection();
}

export function OnboardingFlow({
  initialSelection,
  onComplete,
  theme,
}: OnboardingFlowProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [dataTypeSelection, setDataTypeSelection] = useState<DataTypeSelection>(
    initialSelection,
  );
  const [painPointId, setPainPointId] = useState<PainPointId | null>(null);
  const [preferredSources, setPreferredSources] = useState<ExtractionSource[]>([
    'text',
    'photos',
  ]);
  const [hasRunPreview, setHasRunPreview] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);
  const enabledTypes = getEnabledDataTypes(dataTypeSelection);
  const resolvedTypes = getEnabledDataTypes(resolveSelection(dataTypeSelection));
  const selectedPainPoint =
    PAIN_POINTS.find(item => item.id === painPointId) ?? null;
  const selectedSources = SOURCE_OPTIONS.filter(item =>
    preferredSources.includes(item.id),
  );
  const currentStep = ONBOARDING_STEPS[stepIndex];
  const progress = (stepIndex + 1) / ONBOARDING_STEPS.length;
  const typesSummary = formatLabelList(
    resolvedTypes.map(type => DATA_TYPE_LABELS[type].toLowerCase()),
  );
  const sourcesSummary = formatLabelList(
    selectedSources.map(source => source.label.toLowerCase()),
  );
  const permissionNote =
    preferredSources.includes('camera') || preferredSources.includes('photos')
      ? 'Photo and camera access are only requested when you tap those tools.'
      : 'You can start with pasted text now and bring in files or camera later.';

  const canContinue =
    currentStep === 'welcome'
      ? true
      : currentStep === 'goals'
        ? hasEnabledDataType(dataTypeSelection)
        : currentStep === 'pain'
          ? painPointId !== null
          : currentStep === 'sources'
            ? preferredSources.length > 0
            : currentStep === 'demo'
              ? true
              : true;

  const primaryButtonLabel =
    currentStep === 'welcome'
      ? 'Get started'
      : currentStep === 'demo'
        ? hasRunPreview
          ? 'Keep going'
          : 'Run the preview'
        : currentStep === 'ready'
          ? 'Start extracting'
          : 'Continue';

  const handleComplete = () => {
    onComplete(resolveSelection(dataTypeSelection));
  };

  const handlePrimaryAction = () => {
    if (!canContinue) {
      return;
    }

    if (currentStep === 'demo' && !hasRunPreview) {
      setHasRunPreview(true);
      return;
    }

    if (currentStep === 'ready') {
      handleComplete();
      return;
    }

    setStepIndex(index =>
      Math.min(index + 1, ONBOARDING_STEPS.length - 1),
    );
  };

  const toggleDataType = (type: ExtractableDataType) => {
    setDataTypeSelection(selection => ({
      ...selection,
      [type]: !selection[type],
    }));
  };

  const toggleSource = (source: ExtractionSource) => {
    setPreferredSources(currentSources =>
      currentSources.includes(source)
        ? currentSources.filter(item => item !== source)
        : [...currentSources, source],
    );
  };

  const renderWelcomeStep = () => (
    <>
      <View style={styles.heroCard}>
        <View style={styles.heroGlowPrimary} />
        <View style={styles.heroGlowSecondary} />
        <Text style={styles.eyebrow}>Fast first-run setup</Text>
        <Text style={styles.title}>Turn messy messages into clean details</Text>
        <Text style={styles.subtitle}>
          Paste a thread, scan a screenshot, or import a file. The app pulls out
          the parts you actually need.
        </Text>

        <View style={styles.previewMessage}>
          <Text style={styles.previewLabel}>Sample input</Text>
          <Text style={styles.previewText}>
            &ldquo;Can you send the signed file before April 18, 2026? If not,
            email hello@northstar.studio or use the link in the brief.&rdquo;
          </Text>
        </View>

        <View style={styles.previewChipRow}>
          {['Text', 'Photos', 'Files'].map(label => (
            <View key={label} style={styles.previewChip}>
              <Text style={styles.previewChipText}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.previewResultRow}>
          {['Email', 'Date', 'Link'].map(label => (
            <View key={label} style={styles.previewResultPill}>
              <Text style={styles.previewResultText}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.featureRow}>
          <View style={styles.featureIconWrap}>
            <MaterialCommunityIcons
              color={theme.colors.primarySoftText}
              name="gesture-tap-button"
              size={18}
            />
          </View>
          <View style={styles.featureCopy}>
            <Text style={styles.featureTitle}>One tap to start</Text>
            <Text style={styles.featureText}>
              Pick a source and the home screen is ready immediately after setup.
            </Text>
          </View>
        </View>

        <View style={styles.featureRow}>
          <View style={styles.featureIconWrap}>
            <MaterialCommunityIcons
              color={theme.colors.primarySoftText}
              name="tune-variant"
              size={18}
            />
          </View>
          <View style={styles.featureCopy}>
            <Text style={styles.featureTitle}>Fits your workflow</Text>
            <Text style={styles.featureText}>
              We'll personalize the extractor around what you pull out most.
            </Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderGoalsStep = () => (
    <>
      <View style={styles.questionHeader}>
        <Text style={styles.eyebrow}>Step 1</Text>
        <Text style={styles.title}>What do you usually need first?</Text>
        <Text style={styles.subtitle}>
          Pick everything that would save you the most time on day one.
        </Text>
      </View>

      <View style={styles.optionStack}>
        {GOAL_OPTIONS.map(option => {
          const isSelected = dataTypeSelection[option.id];

          return (
            <Pressable
              key={option.id}
              onPress={() => toggleDataType(option.id)}
              testID={`onboarding-goal-${option.id}`}
              style={({pressed}) => [
                styles.optionCard,
                isSelected && styles.optionCardSelected,
                pressed && styles.optionCardPressed,
              ]}>
              <View style={styles.optionIconWrap}>
                <MaterialCommunityIcons
                  color={theme.colors.primarySoftText}
                  name={option.icon}
                  size={22}
                />
              </View>
              <View style={styles.optionCopy}>
                <Text style={styles.optionTitle}>{option.label}</Text>
                <Text style={styles.optionText}>{option.description}</Text>
              </View>
              <MaterialCommunityIcons
                color={
                  isSelected
                    ? theme.colors.primary
                    : theme.colors.textMuted
                }
                name={
                  isSelected
                    ? 'check-circle'
                    : 'checkbox-blank-circle-outline'
                }
                size={22}
              />
            </Pressable>
          );
        })}
      </View>
    </>
  );

  const renderPainStep = () => (
    <>
      <View style={styles.questionHeader}>
        <Text style={styles.eyebrow}>Step 2</Text>
        <Text style={styles.title}>What slows you down most?</Text>
        <Text style={styles.subtitle}>
          Choose the one that feels uncomfortably familiar.
        </Text>
      </View>

      <View style={styles.optionStack}>
        {PAIN_POINTS.map(option => {
          const isSelected = painPointId === option.id;

          return (
            <Pressable
              key={option.id}
              onPress={() => setPainPointId(option.id)}
              testID={`onboarding-pain-${option.id}`}
              style={({pressed}) => [
                styles.optionCard,
                isSelected && styles.optionCardSelected,
                pressed && styles.optionCardPressed,
              ]}>
              <View style={styles.optionIconWrap}>
                <MaterialCommunityIcons
                  color={theme.colors.primarySoftText}
                  name={option.icon}
                  size={22}
                />
              </View>
              <View style={styles.optionCopy}>
                <Text style={styles.optionTitle}>{option.label}</Text>
                <Text style={styles.optionText}>{option.description}</Text>
              </View>
              <MaterialCommunityIcons
                color={
                  isSelected
                    ? theme.colors.primary
                    : theme.colors.textMuted
                }
                name={
                  isSelected
                    ? 'radiobox-marked'
                    : 'radiobox-blank'
                }
                size={22}
              />
            </Pressable>
          );
        })}
      </View>
    </>
  );

  const renderSourcesStep = () => (
    <>
      <View style={styles.questionHeader}>
        <Text style={styles.eyebrow}>Step 3</Text>
        <Text style={styles.title}>Where does the mess usually live?</Text>
        <Text style={styles.subtitle}>
          We'll tune the first run around the sources you reach for most.
        </Text>
      </View>

      <View style={styles.sourceGrid}>
        {SOURCE_OPTIONS.map(option => {
          const isSelected = preferredSources.includes(option.id);

          return (
            <Pressable
              key={option.id}
              onPress={() => toggleSource(option.id)}
              testID={`onboarding-source-${option.id}`}
              style={({pressed}) => [
                styles.sourceCard,
                isSelected && styles.optionCardSelected,
                pressed && styles.optionCardPressed,
              ]}>
              <View style={styles.optionIconWrap}>
                <MaterialCommunityIcons
                  color={theme.colors.primarySoftText}
                  name={option.icon}
                  size={22}
                />
              </View>
              <Text style={styles.sourceTitle}>{option.label}</Text>
              <Text style={styles.sourceText}>{option.description}</Text>
              <MaterialCommunityIcons
                color={
                  isSelected
                    ? theme.colors.primary
                    : theme.colors.textMuted
                }
                name={
                  isSelected
                    ? 'check-circle'
                    : 'checkbox-blank-circle-outline'
                }
                size={20}
                style={styles.sourceCheck}
              />
            </Pressable>
          );
        })}
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.featureTitle}>Permission timing</Text>
        <Text style={styles.featureText}>{permissionNote}</Text>
      </View>
    </>
  );

  const renderDemoStep = () => (
    <>
      <View style={styles.questionHeader}>
        <Text style={styles.eyebrow}>Step 4</Text>
        <Text style={styles.title}>Run a 10-second preview</Text>
        <Text style={styles.subtitle}>
          This is the core moment: messy input in, usable details out.
        </Text>
      </View>

      <View style={styles.demoCard}>
        <View style={styles.previewMessage}>
          <Text style={styles.previewLabel}>Preview thread</Text>
          <Text style={styles.previewText}>
            Alex, can you review the brief before April 18, 2026? If anything
            changes, message hello@northstar.studio or use
            {' '}
            https://northstar.studio/invite.
          </Text>
        </View>

        <View style={styles.previewChipRow}>
          {resolvedTypes.map(type => (
            <View key={type} style={styles.previewChip}>
              <Text style={styles.previewChipText}>
                {DATA_TYPE_LABELS[type]}
              </Text>
            </View>
          ))}
        </View>

        {hasRunPreview ? (
          <View style={styles.previewResultsCard}>
            <Text style={styles.featureTitle}>Pulled out for you</Text>
            {resolvedTypes.map(type => (
              <View key={type} style={styles.previewResultItem}>
                <Text style={styles.previewResultType}>{DATA_TYPE_LABELS[type]}</Text>
                <Text style={styles.previewResultValue}>{SAMPLE_RESULTS[type]}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.demoHint}>
            Tap "Run the preview" to reveal the exact details this app would
            surface first.
          </Text>
        )}
      </View>
    </>
  );

  const renderReadyStep = () => (
    <>
      <View style={styles.questionHeader}>
        <Text style={styles.eyebrow}>All set</Text>
        <Text style={styles.title}>Your extractor is tuned for fast wins</Text>
        <Text style={styles.subtitle}>
          You can change any of this later, but this gives you the fastest path
          to value on the home screen.
        </Text>
      </View>

      <View style={styles.optionStack}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIconWrap}>
            <MaterialCommunityIcons
              color={theme.colors.primaryOn}
              name="target"
              size={18}
            />
          </View>
          <View style={styles.optionCopy}>
            <Text style={styles.optionTitle}>Prioritized outputs</Text>
            <Text style={styles.optionText}>
              We'll put
              {' '}
              {typesSummary}
              {' '}
              front and center from the first scan.
            </Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryIconWrap}>
            <MaterialCommunityIcons
              color={theme.colors.primaryOn}
              name="layers-triple-outline"
              size={18}
            />
          </View>
          <View style={styles.optionCopy}>
            <Text style={styles.optionTitle}>Best-fit sources</Text>
            <Text style={styles.optionText}>
              Your likely first win comes from
              {' '}
              {sourcesSummary}
              .
            </Text>
          </View>
        </View>

        {selectedPainPoint ? (
          <View style={styles.summaryCard}>
            <View style={styles.summaryIconWrap}>
              <MaterialCommunityIcons
                color={theme.colors.primaryOn}
                name="sparkles"
                size={18}
              />
            </View>
            <View style={styles.optionCopy}>
              <Text style={styles.optionTitle}>Built to remove this friction</Text>
              <Text style={styles.optionText}>{selectedPainPoint.label}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 'welcome':
        return renderWelcomeStep();
      case 'goals':
        return renderGoalsStep();
      case 'pain':
        return renderPainStep();
      case 'sources':
        return renderSourcesStep();
      case 'demo':
        return renderDemoStep();
      case 'ready':
        return renderReadyStep();
    }
  };

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={styles.safeArea}
      testID="onboarding-root">
      <View style={styles.root}>
        <View style={styles.screenGlowPrimary} />
        <View style={styles.screenGlowSecondary} />

        <View style={styles.topBar}>
          <View style={styles.progressWrap}>
            <Text style={styles.progressText}>
              Step
              {' '}
              {stepIndex + 1}
              {' '}
              of
              {' '}
              {ONBOARDING_STEPS.length}
            </Text>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {width: `${Math.max(progress * 100, 12)}%`},
                ]}
              />
            </View>
          </View>

          <Pressable onPress={handleComplete} testID="onboarding-skip">
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {renderStep()}
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            disabled={stepIndex === 0}
            onPress={() => {
              setStepIndex(index => Math.max(index - 1, 0));
            }}
            testID="onboarding-back"
            style={({pressed}) => [
              styles.backButton,
              stepIndex === 0 && styles.backButtonDisabled,
              pressed && stepIndex > 0 && styles.backButtonPressed,
            ]}>
            <Text style={styles.backButtonText}>Back</Text>
          </Pressable>

          <Pressable
            disabled={!canContinue}
            onPress={handlePrimaryAction}
            testID="onboarding-primary"
            style={({pressed}) => [
              styles.primaryButton,
              !canContinue && styles.primaryButtonDisabled,
              pressed && canContinue && styles.primaryButtonPressed,
            ]}>
            <Text style={styles.primaryButtonText}>{primaryButtonLabel}</Text>
          </Pressable>
        </View>
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
    root: {
      flex: 1,
      backgroundColor: theme.colors.appBackground,
      paddingHorizontal: 18,
    },
    screenGlowPrimary: {
      position: 'absolute',
      top: -80,
      right: -40,
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: theme.colors.heroGlowPrimary,
    },
    screenGlowSecondary: {
      position: 'absolute',
      bottom: 120,
      left: -60,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: theme.colors.heroGlowSecondary,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      paddingTop: 6,
      paddingBottom: 10,
    },
    progressWrap: {
      flex: 1,
      gap: 8,
    },
    progressText: {
      color: theme.colors.textSecondary,
      fontSize: 13,
      fontWeight: '700',
      letterSpacing: 0.3,
      textTransform: 'uppercase',
    },
    progressTrack: {
      height: 8,
      borderRadius: 999,
      backgroundColor: theme.colors.border,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 999,
      backgroundColor: theme.colors.primary,
    },
    skipText: {
      color: theme.colors.primarySoftText,
      fontSize: 15,
      fontWeight: '700',
    },
    scrollContent: {
      paddingBottom: 20,
      gap: 18,
    },
    heroCard: {
      backgroundColor: theme.colors.heroBackground,
      borderRadius: 30,
      paddingHorizontal: 22,
      paddingTop: 24,
      paddingBottom: 22,
      overflow: 'hidden',
      gap: 14,
      ...createShadow(theme.colors.shadow, 0.1, 22, 12, 6),
    },
    heroGlowPrimary: {
      position: 'absolute',
      top: -30,
      right: -18,
      width: 170,
      height: 170,
      borderRadius: 85,
      backgroundColor: theme.colors.heroGlowPrimary,
    },
    heroGlowSecondary: {
      position: 'absolute',
      bottom: -28,
      left: -16,
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: theme.colors.heroGlowSecondary,
    },
    eyebrow: {
      color:
        theme.id === 'dark'
          ? theme.colors.heroTextSecondary
          : theme.colors.primarySoftText,
      fontSize: 13,
      fontWeight: '800',
      letterSpacing: 1.1,
      textTransform: 'uppercase',
    },
    title: {
      color:
        theme.id === 'dark'
          ? theme.colors.heroTextPrimary
          : theme.colors.textPrimary,
      fontSize: 34,
      lineHeight: 38,
      fontWeight: '900',
    },
    subtitle: {
      color:
        theme.id === 'dark'
          ? theme.colors.heroTextSecondary
          : theme.colors.textSecondary,
      fontSize: 17,
      lineHeight: 26,
    },
    previewMessage: {
      backgroundColor: theme.colors.heroSurface,
      borderWidth: 1,
      borderColor: theme.colors.heroSurfaceBorder,
      borderRadius: 22,
      padding: 16,
      gap: 8,
    },
    previewLabel: {
      color: theme.colors.primarySoftText,
      fontSize: 12,
      fontWeight: '800',
      letterSpacing: 0.8,
      textTransform: 'uppercase',
    },
    previewText: {
      color: theme.colors.textPrimary,
      fontSize: 16,
      lineHeight: 23,
      fontWeight: '600',
    },
    previewChipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    previewChip: {
      borderRadius: 999,
      backgroundColor: theme.colors.primarySoft,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    previewChipText: {
      color: theme.colors.primarySoftText,
      fontSize: 13,
      fontWeight: '700',
    },
    previewResultRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    previewResultPill: {
      borderRadius: 18,
      backgroundColor:
        theme.id === 'dark'
          ? 'rgba(255,255,255,0.12)'
          : 'rgba(255,255,255,0.16)',
      paddingHorizontal: 14,
      paddingVertical: 10,
    },
    previewResultText: {
      color: theme.colors.heroTextPrimary,
      fontSize: 13,
      fontWeight: '800',
    },
    infoCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      padding: 18,
      gap: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...createShadow(theme.colors.shadow, 0.06, 16, 8, 4),
    },
    featureRow: {
      flexDirection: 'row',
      gap: 14,
    },
    featureIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primarySoft,
    },
    featureCopy: {
      flex: 1,
      gap: 4,
    },
    featureTitle: {
      color: theme.colors.textPrimary,
      fontSize: 17,
      fontWeight: '800',
    },
    featureText: {
      color: theme.colors.textSecondary,
      fontSize: 15,
      lineHeight: 22,
    },
    questionHeader: {
      gap: 10,
      paddingTop: 8,
    },
    optionStack: {
      gap: 12,
    },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...createShadow(theme.colors.shadow, 0.05, 14, 8, 3),
    },
    optionCardSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primarySoft,
    },
    optionCardPressed: {
      transform: [{scale: 0.992}],
    },
    optionIconWrap: {
      width: 46,
      height: 46,
      borderRadius: 23,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primarySoftPressed,
    },
    optionCopy: {
      flex: 1,
      gap: 4,
    },
    optionTitle: {
      color: theme.colors.textPrimary,
      fontSize: 17,
      fontWeight: '800',
      lineHeight: 22,
    },
    optionText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      lineHeight: 21,
    },
    sourceGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 12,
    },
    sourceCard: {
      width: '48%',
      minHeight: 164,
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...createShadow(theme.colors.shadow, 0.05, 14, 8, 3),
    },
    sourceTitle: {
      color: theme.colors.textPrimary,
      fontSize: 16,
      fontWeight: '800',
      marginTop: 18,
      marginBottom: 6,
    },
    sourceText: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
    },
    sourceCheck: {
      position: 'absolute',
      right: 14,
      bottom: 14,
    },
    demoCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 28,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 16,
      ...createShadow(theme.colors.shadow, 0.06, 16, 8, 4),
    },
    demoHint: {
      color: theme.colors.textSecondary,
      fontSize: 15,
      lineHeight: 22,
    },
    previewResultsCard: {
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: 20,
      padding: 14,
      gap: 10,
    },
    previewResultItem: {
      gap: 4,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    previewResultType: {
      color: theme.colors.textMuted,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    previewResultValue: {
      color: theme.colors.textPrimary,
      fontSize: 16,
      lineHeight: 22,
      fontWeight: '700',
    },
    summaryCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...createShadow(theme.colors.shadow, 0.05, 14, 8, 3),
    },
    summaryIconWrap: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.primary,
    },
    footer: {
      flexDirection: 'row',
      gap: 12,
      paddingTop: 10,
      paddingBottom: 8,
    },
    backButton: {
      flex: 0.85,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: theme.colors.borderSoft,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
    },
    backButtonDisabled: {
      opacity: 0,
    },
    backButtonPressed: {
      backgroundColor: theme.colors.surfacePressed,
    },
    backButtonText: {
      color: theme.colors.textPrimary,
      fontSize: 16,
      fontWeight: '800',
    },
    primaryButton: {
      flex: 1.6,
      borderRadius: 22,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      ...createShadow(theme.colors.shadow, 0.12, 12, 6, 4),
    },
    primaryButtonDisabled: {
      opacity: 0.45,
    },
    primaryButtonPressed: {
      backgroundColor: theme.colors.primaryPressed,
    },
    primaryButtonText: {
      color: theme.colors.primaryOn,
      fontSize: 16,
      fontWeight: '900',
    },
  });
}
