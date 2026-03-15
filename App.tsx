import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {ExtractorScreen, ExtractorScreenHandle} from './src/features/extractor/ExtractorScreen';
import {HistoryScreen} from './src/features/history/HistoryScreen';
import {
  persistDataTypeSelection,
  readDataTypeSelection,
} from './src/features/settings/dataTypeStorage';
import {SettingsScreen} from './src/features/settings/SettingsScreen';
import {
  createDefaultDataTypeSelection,
  DataTypeSelection,
} from './src/shared/extractedData';
import {HistorySession} from './src/shared/types';
import {persistThemePreference, readThemePreference} from './src/theme/themeStorage';
import {AppTheme, ThemeId, themes, createShadow} from './src/theme/themes';

const TABS = [
  {
    id: 'home',
    label: 'Home',
    icon: {inactive: 'home-variant-outline', active: 'home-variant'},
  },
  {
    id: 'history',
    label: 'History',
    icon: {inactive: 'history', active: 'history'},
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: {inactive: 'cog-outline', active: 'cog'},
  },
] as const;

type TabId = (typeof TABS)[number]['id'];

function AppShell() {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const extractorRef = useRef<ExtractorScreenHandle>(null);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const [dataTypeSelection, setDataTypeSelection] = useState<DataTypeSelection>(() =>
    createDefaultDataTypeSelection(),
  );
  const [themeId, setThemeId] = useState<ThemeId>('light');
  const animatedTabIndex = useRef(new Animated.Value(0)).current;
  const animatedPillScale = useRef(new Animated.Value(1)).current;
  const previousTabIndexRef = useRef(0);

  const theme = themes[themeId];
  const styles = useMemo(() => createStyles(theme), [theme]);
  const fallbackTabBarWidth = Math.max(width - 32, 0);
  const resolvedTabBarWidth = tabBarWidth || fallbackTabBarWidth;
  const tabTrackWidth = Math.max(resolvedTabBarWidth - 20, 0);
  const tabSegmentWidth = tabTrackWidth / TABS.length;

  useEffect(() => {
    readThemePreference()
      .then(setThemeId)
      .catch(() => {
        setThemeId('light');
      });

    readDataTypeSelection()
      .then(setDataTypeSelection)
      .catch(() => {
        setDataTypeSelection(createDefaultDataTypeSelection());
      });
  }, []);

  useEffect(() => {
    const nextIndex = TABS.findIndex(tab => tab.id === activeTab);
    const delta = nextIndex - previousTabIndexRef.current;

    if (delta === 0) {
      return;
    }

    animatedPillScale.setValue(0.94);

    Animated.parallel([
      Animated.spring(animatedTabIndex, {
        toValue: nextIndex,
        velocity: delta * 2.2,
        stiffness: 320,
        damping: 28,
        mass: 0.88,
        useNativeDriver: true,
      }),
      Animated.spring(animatedPillScale, {
        toValue: 1,
        velocity: Math.abs(delta) * 0.35,
        stiffness: 300,
        damping: 16,
        mass: 0.72,
        useNativeDriver: true,
      }),
    ]).start();

    previousTabIndexRef.current = nextIndex;
  }, [activeTab, animatedPillScale, animatedTabIndex]);

  const handleSelectSession = (session: HistorySession) => {
    extractorRef.current?.loadSession(session);
    setActiveTab('home');
  };

  const handleThemeChange = (nextThemeId: ThemeId) => {
    setThemeId(nextThemeId);
    persistThemePreference(nextThemeId).catch(() => {});
  };

  const handleDataTypeSelectionChange = (nextSelection: DataTypeSelection) => {
    setDataTypeSelection(nextSelection);
    persistDataTypeSelection(nextSelection).catch(() => {});
  };

  const activePillTranslateX = Animated.multiply(animatedTabIndex, tabSegmentWidth);

  return (
    <>
      <StatusBar barStyle={theme.statusBarStyle} />

      <View style={styles.app} testID="app-root">
        <View style={styles.screenHost}>
          <View style={[styles.screenLayer, activeTab !== 'home' && styles.hiddenScreen]}>
            <ExtractorScreen
              ref={extractorRef}
              dataTypeSelection={dataTypeSelection}
              theme={theme}
            />
          </View>

          <View style={[styles.screenLayer, activeTab !== 'history' && styles.hiddenScreen]}>
            <HistoryScreen
              isActive={activeTab === 'history'}
              onSelectSession={handleSelectSession}
              theme={theme}
            />
          </View>

          <View style={[styles.screenLayer, activeTab !== 'settings' && styles.hiddenScreen]}>
            <SettingsScreen
              dataTypeSelection={dataTypeSelection}
              onDataTypeSelectionChange={handleDataTypeSelectionChange}
              onThemeChange={handleThemeChange}
              selectedThemeId={themeId}
              theme={theme}
            />
          </View>
        </View>

        <View style={[styles.tabBarWrap, {paddingBottom: Math.max(insets.bottom, 12)}]}>
          <View
            style={styles.tabBar}
            onLayout={event => {
              setTabBarWidth(event.nativeEvent.layout.width);
            }}>
            <Animated.View
              pointerEvents="none"
              style={[
                styles.tabActivePill,
                {
                  width: tabSegmentWidth,
                  transform: [
                    {translateX: activePillTranslateX},
                    {scale: animatedPillScale},
                  ],
                },
              ]}
            />

            {TABS.map((tab, index) => {
              const isActive = activeTab === tab.id;
              const contentScale = animatedTabIndex.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [0.96, 1, 0.96],
                extrapolate: 'clamp',
              });
              const contentTranslateY = animatedTabIndex.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [4, 0, 4],
                extrapolate: 'clamp',
              });
              const contentOpacity = animatedTabIndex.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [0.76, 1, 0.76],
                extrapolate: 'clamp',
              });
              const badgeScale = animatedTabIndex.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [0.92, 1.08, 0.92],
                extrapolate: 'clamp',
              });

              return (
                <Pressable
                  key={tab.id}
                  onPress={() => {
                    if (activeTab !== tab.id) {
                      setActiveTab(tab.id);
                    }
                  }}
                  testID={`tab-${tab.id}`}
                  style={({pressed}) => [
                    styles.tabButton,
                    pressed && styles.tabButtonPressed,
                  ]}>
                  <Animated.View
                    style={[
                      styles.tabButtonContent,
                      {
                        opacity: contentOpacity,
                        transform: [
                          {translateY: contentTranslateY},
                          {scale: contentScale},
                        ],
                      },
                    ]}>
                    <Animated.View
                      style={[
                        styles.tabBadge,
                        isActive && styles.tabBadgeActive,
                        {transform: [{scale: badgeScale}]},
                      ]}>
	                      <MaterialCommunityIcons
	                        color={
	                          isActive
	                            ? theme.colors.tabLabelActive
	                            : theme.colors.tabInactiveIcon
	                        }
	                        name={isActive ? tab.icon.active : tab.icon.inactive}
	                        size={22}
	                      />
                    </Animated.View>
                    <Text
                      style={[
                        styles.tabLabel,
                        isActive && styles.tabLabelActive,
                      ]}>
                      {tab.label}
                    </Text>
                  </Animated.View>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <AppShell />
    </SafeAreaProvider>
  );
}

function createStyles(theme: AppTheme) {
  return StyleSheet.create({
    app: {
      flex: 1,
      backgroundColor: theme.colors.appBackground,
    },
    screenHost: {
      flex: 1,
    },
    screenLayer: {
      flex: 1,
    },
    hiddenScreen: {
      display: 'none',
    },
    tabBarWrap: {
      paddingHorizontal: 16,
      paddingTop: 10,
      backgroundColor: theme.colors.appBackground,
    },
    tabBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.colors.tabBarBackground,
      borderRadius: 28,
      paddingHorizontal: 10,
      paddingVertical: 10,
      overflow: 'hidden',
      ...createShadow(theme.colors.shadow, 0.08, 18, 10, 6),
    },
    tabActivePill: {
      position: 'absolute',
      left: 10,
      top: 10,
      bottom: 10,
      borderRadius: 22,
      backgroundColor: theme.colors.tabActiveBackground,
      ...createShadow(theme.colors.tabActiveShadow, 0.16, 14, 10, 4),
    },
    tabButton: {
      flex: 1,
      zIndex: 1,
      borderRadius: 22,
      paddingVertical: 10,
      paddingHorizontal: 6,
    },
    tabButtonContent: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    tabButtonPressed: {
      opacity: 0.94,
      transform: [{scale: 0.985}],
    },
	    tabBadge: {
	      width: 36,
	      height: 36,
	      borderRadius: 18,
	      backgroundColor: theme.colors.tabInactiveBadgeBackground,
	      alignItems: 'center',
	      justifyContent: 'center',
	      marginBottom: 6,
	    },
    tabBadgeActive: {
      backgroundColor:
        theme.id === 'dark'
          ? 'rgba(8, 17, 26, 0.14)'
          : theme.id === 'solar'
            ? 'rgba(255, 248, 232, 0.18)'
            : 'rgba(255, 255, 255, 0.14)',
    },
    tabLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.colors.tabLabel,
    },
    tabLabelActive: {
      color: theme.colors.tabLabelActive,
    },
  });
}

export default App;
