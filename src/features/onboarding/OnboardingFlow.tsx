import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SafeAreaView} from 'react-native-safe-area-context';

import {useI18n} from '../../localization/i18n';
import {
  createDefaultDataTypeSelection,
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
  icon: string;
  id: ExtractableDataType;
}> = [
  {
    id: 'email',
    icon: 'email-fast-outline',
  },
  {
    id: 'date',
    icon: 'calendar-clock-outline',
  },
  {
    id: 'link',
    icon: 'link-variant',
  },
];

const PAIN_POINTS = [
  {
    id: 'retyping',
    icon: 'keyboard-outline',
  },
  {
    id: 'buried',
    icon: 'message-text-clock-outline',
  },
  {
    id: 'screenshots',
    icon: 'image-search-outline',
  },
  {
    id: 'handoff',
    icon: 'send-outline',
  },
] as const;

type PainPointId = (typeof PAIN_POINTS)[number]['id'];

const SOURCE_OPTIONS: Array<{
  icon: string;
  id: ExtractionSource;
}> = [
  {
    id: 'text',
    icon: 'content-paste',
  },
  {
    id: 'photos',
    icon: 'image-outline',
  },
  {
    id: 'files',
    icon: 'file-document-outline',
  },
  {
    id: 'camera',
    icon: 'camera-outline',
  },
];

const SAMPLE_RESULTS: Record<ExtractableDataType, string> = {
  email: 'hello@northstar.studio',
  date: '2026-04-18T00:00:00.000Z',
  link: 'https://northstar.studio/invite',
};

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
  const i18n = useI18n();
  const {width} = useWindowDimensions();
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
  const scrollViewRef = useRef<ScrollView>(null);
  const transitionDirectionRef = useRef<1 | -1>(1);
  const hasAnimatedOnceRef = useRef(false);
  const slideTranslateX = useRef(new Animated.Value(0)).current;
  const slideTranslateY = useRef(new Animated.Value(0)).current;
  const slideScale = useRef(new Animated.Value(1)).current;
  const slideOpacity = useRef(new Animated.Value(1)).current;

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
  const transitionDistance = Math.min(Math.max(width * 0.12, 36), 64);
  const typesSummary = i18n.formatList(
    resolvedTypes.map(type => i18n.dataTypeListLabel(type)),
  );
  const sourcesSummary = i18n.formatList(
    selectedSources.map(source => i18n.sourceListLabel(source.id)),
  );
  const permissionNote =
    preferredSources.includes('camera') || preferredSources.includes('photos')
      ? i18n.strings.onboarding.permissionTimingMedia
      : i18n.strings.onboarding.permissionTimingText;

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
      ? i18n.strings.common.getStarted
      : currentStep === 'demo'
        ? hasRunPreview
          ? i18n.strings.common.keepGoing
          : i18n.strings.common.runPreview
        : currentStep === 'ready'
          ? i18n.strings.common.startExtracting
          : i18n.strings.common.continue;

  const handleComplete = () => {
    onComplete(resolveSelection(dataTypeSelection));
  };

  const goToStep = (nextIndex: number, direction: 1 | -1) => {
    if (nextIndex === stepIndex) {
      return;
    }

    transitionDirectionRef.current = direction;
    setStepIndex(nextIndex);
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

    goToStep(Math.min(stepIndex + 1, ONBOARDING_STEPS.length - 1), 1);
  };

  useEffect(() => {
    if (!hasAnimatedOnceRef.current) {
      hasAnimatedOnceRef.current = true;
      return;
    }

    scrollViewRef.current?.scrollTo({y: 0, animated: false});

    slideTranslateX.stopAnimation();
    slideTranslateY.stopAnimation();
    slideScale.stopAnimation();
    slideOpacity.stopAnimation();

    const direction = transitionDirectionRef.current;

    slideTranslateX.setValue(direction * transitionDistance);
    slideTranslateY.setValue(18);
    slideScale.setValue(0.985);
    slideOpacity.setValue(0);

    Animated.parallel([
      Animated.spring(slideTranslateX, {
        toValue: 0,
        velocity: direction * 3.6,
        stiffness: 260,
        damping: 24,
        mass: 0.9,
        useNativeDriver: true,
      }),
      Animated.spring(slideTranslateY, {
        toValue: 0,
        velocity: 1.8,
        stiffness: 230,
        damping: 22,
        mass: 0.92,
        useNativeDriver: true,
      }),
      Animated.spring(slideScale, {
        toValue: 1,
        velocity: 1.4,
        stiffness: 280,
        damping: 18,
        mass: 0.82,
        useNativeDriver: true,
      }),
      Animated.timing(slideOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [
    stepIndex,
    slideOpacity,
    slideScale,
    slideTranslateX,
    slideTranslateY,
    transitionDistance,
  ]);

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
        <Text style={styles.eyebrow}>{i18n.strings.onboarding.welcomeEyebrow}</Text>
        <Text style={styles.title}>{i18n.strings.onboarding.welcomeTitle}</Text>
        <Text style={styles.subtitle}>{i18n.strings.onboarding.welcomeSubtitle}</Text>

        <View style={styles.previewMessage}>
          <Text style={styles.previewLabel}>{i18n.strings.onboarding.sampleInputLabel}</Text>
          <Text style={styles.previewText}>
            {i18n.t(i18n.strings.onboarding.sampleInputText, {
              sampleDate: i18n.formatSampleDate(SAMPLE_RESULTS.date),
            })}
          </Text>
        </View>

        <View style={styles.previewChipRow}>
          {(['text', 'photos', 'files'] as const).map(source => (
            <View key={source} style={styles.previewChip}>
              <Text style={styles.previewChipText}>{i18n.sourceLabel(source)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.previewResultRow}>
          {(['email', 'date', 'link'] as const).map(type => (
            <View key={type} style={styles.previewResultPill}>
              <Text style={styles.previewResultText}>{i18n.dataTypeLabel(type)}</Text>
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
            <Text style={styles.featureTitle}>{i18n.strings.onboarding.featureStartTitle}</Text>
            <Text style={styles.featureText}>{i18n.strings.onboarding.featureStartText}</Text>
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
            <Text style={styles.featureTitle}>
              {i18n.strings.onboarding.featureWorkflowTitle}
            </Text>
            <Text style={styles.featureText}>
              {i18n.strings.onboarding.featureWorkflowText}
            </Text>
          </View>
        </View>
      </View>
    </>
  );

  const renderGoalsStep = () => (
    <>
      <View style={styles.questionHeader}>
        <Text style={styles.eyebrow}>
          {i18n.t(i18n.strings.common.stepCounter, {
            current: 1,
            total: ONBOARDING_STEPS.length,
          })}
        </Text>
        <Text style={styles.title}>{i18n.strings.onboarding.goalsTitle}</Text>
        <Text style={styles.subtitle}>{i18n.strings.onboarding.goalsSubtitle}</Text>
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
                <Text style={styles.optionTitle}>
                  {i18n.strings.dataTypes[option.id].goalLabel}
                </Text>
                <Text style={styles.optionText}>
                  {i18n.strings.dataTypes[option.id].goalDescription}
                </Text>
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
        <Text style={styles.eyebrow}>
          {i18n.t(i18n.strings.common.stepCounter, {
            current: 2,
            total: ONBOARDING_STEPS.length,
          })}
        </Text>
        <Text style={styles.title}>{i18n.strings.onboarding.painTitle}</Text>
        <Text style={styles.subtitle}>{i18n.strings.onboarding.painSubtitle}</Text>
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
                <Text style={styles.optionTitle}>
                  {i18n.strings.onboarding.painPoints[option.id].label}
                </Text>
                <Text style={styles.optionText}>
                  {i18n.strings.onboarding.painPoints[option.id].description}
                </Text>
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
        <Text style={styles.eyebrow}>
          {i18n.t(i18n.strings.common.stepCounter, {
            current: 3,
            total: ONBOARDING_STEPS.length,
          })}
        </Text>
        <Text style={styles.title}>{i18n.strings.onboarding.sourcesTitle}</Text>
        <Text style={styles.subtitle}>{i18n.strings.onboarding.sourcesSubtitle}</Text>
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
              <Text style={styles.sourceTitle}>
                {i18n.strings.sources[option.id].onboardingLabel}
              </Text>
              <Text style={styles.sourceText}>
                {i18n.strings.sources[option.id].onboardingDescription}
              </Text>
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
        <Text style={styles.featureTitle}>{i18n.strings.onboarding.permissionTimingTitle}</Text>
        <Text style={styles.featureText}>{permissionNote}</Text>
      </View>
    </>
  );

  const renderDemoStep = () => (
    <>
      <View style={styles.questionHeader}>
        <Text style={styles.eyebrow}>
          {i18n.t(i18n.strings.common.stepCounter, {
            current: 4,
            total: ONBOARDING_STEPS.length,
          })}
        </Text>
        <Text style={styles.title}>{i18n.strings.onboarding.demoTitle}</Text>
        <Text style={styles.subtitle}>{i18n.strings.onboarding.demoSubtitle}</Text>
      </View>

      <View style={styles.demoCard}>
        <View style={styles.previewMessage}>
          <Text style={styles.previewLabel}>{i18n.strings.onboarding.previewThreadLabel}</Text>
          <Text style={styles.previewText}>
            {i18n.t(i18n.strings.onboarding.previewThreadText, {
              sampleDate: i18n.formatSampleDate(SAMPLE_RESULTS.date),
            })}
          </Text>
        </View>

        <View style={styles.previewChipRow}>
          {resolvedTypes.map(type => (
            <View key={type} style={styles.previewChip}>
              <Text style={styles.previewChipText}>
                {i18n.dataTypeLabel(type)}
              </Text>
            </View>
          ))}
        </View>

        {hasRunPreview ? (
          <View style={styles.previewResultsCard}>
            <Text style={styles.featureTitle}>{i18n.strings.onboarding.pulledOutForYou}</Text>
            {resolvedTypes.map(type => (
              <View key={type} style={styles.previewResultItem}>
                <Text style={styles.previewResultType}>{i18n.dataTypeLabel(type)}</Text>
                <Text style={styles.previewResultValue}>
                  {type === 'date'
                    ? i18n.formatSampleDate(SAMPLE_RESULTS[type])
                    : SAMPLE_RESULTS[type]}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.demoHint}>{i18n.strings.onboarding.runPreviewHint}</Text>
        )}
      </View>
    </>
  );

  const renderReadyStep = () => (
    <>
      <View style={styles.questionHeader}>
        <Text style={styles.eyebrow}>
          {i18n.t(i18n.strings.common.stepCounter, {
            current: ONBOARDING_STEPS.length,
            total: ONBOARDING_STEPS.length,
          })}
        </Text>
        <Text style={styles.title}>{i18n.strings.onboarding.readyTitle}</Text>
        <Text style={styles.subtitle}>{i18n.strings.onboarding.readySubtitle}</Text>
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
            <Text style={styles.optionTitle}>
              {i18n.strings.onboarding.prioritizedOutputsTitle}
            </Text>
            <Text style={styles.optionText}>
              {i18n.t(i18n.strings.onboarding.prioritizedOutputsText, {
                typesSummary,
              })}
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
            <Text style={styles.optionTitle}>{i18n.strings.onboarding.bestFitSourcesTitle}</Text>
            <Text style={styles.optionText}>
              {i18n.t(i18n.strings.onboarding.bestFitSourcesText, {
                sourcesSummary,
              })}
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
              <Text style={styles.optionTitle}>{i18n.strings.onboarding.frictionTitle}</Text>
              <Text style={styles.optionText}>
                {i18n.strings.onboarding.painPoints[selectedPainPoint.id].label}
              </Text>
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
              {i18n.t(i18n.strings.common.stepCounter, {
                current: stepIndex + 1,
                total: ONBOARDING_STEPS.length,
              })}
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
            <Text style={styles.skipText}>{i18n.strings.common.skip}</Text>
          </Pressable>
        </View>

        <ScrollView
          ref={scrollViewRef}
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.stepContent,
              {
                opacity: slideOpacity,
                transform: [
                  {translateX: slideTranslateX},
                  {translateY: slideTranslateY},
                  {scale: slideScale},
                ],
              },
            ]}>
            {renderStep()}
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            disabled={stepIndex === 0}
            onPress={() => {
              goToStep(Math.max(stepIndex - 1, 0), -1);
            }}
            testID="onboarding-back"
            style={({pressed}) => [
              styles.backButton,
              stepIndex === 0 && styles.backButtonDisabled,
              pressed && stepIndex > 0 && styles.backButtonPressed,
            ]}>
            <Text style={styles.backButtonText}>{i18n.strings.common.back}</Text>
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
    },
    stepContent: {
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
