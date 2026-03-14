import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {clearPersistedHistory, readHistory} from './src/domain/history/historyStorage';
import {
  ExtractorScreen,
  ExtractorScreenHandle,
} from './src/features/extractor/ExtractorScreen';
import {HistoryScreen} from './src/features/history/HistoryScreen';
import {SettingsScreen} from './src/features/settings/SettingsScreen';
import {HistorySession} from './src/shared/types';

const TABS = [
  {id: 'home', label: 'Home', badge: 'H'},
  {id: 'history', label: 'History', badge: 'R'},
  {id: 'settings', label: 'Settings', badge: 'S'},
] as const;

type TabId = (typeof TABS)[number]['id'];

function AppShell() {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const extractorRef = useRef<ExtractorScreenHandle>(null);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [historyCount, setHistoryCount] = useState(0);
  const [tabBarWidth, setTabBarWidth] = useState(0);
  const animatedTabIndex = useRef(new Animated.Value(0)).current;
  const animatedPillScale = useRef(new Animated.Value(1)).current;
  const previousTabIndexRef = useRef(0);

  const fallbackTabBarWidth = Math.max(width - 32, 0);
  const resolvedTabBarWidth = tabBarWidth || fallbackTabBarWidth;
  const tabTrackWidth = Math.max(resolvedTabBarWidth - 20, 0);
  const tabSegmentWidth = tabTrackWidth / TABS.length;

  useEffect(() => {
    readHistory()
      .then(sessions => {
        setHistoryCount(sessions.length);
      })
      .catch(() => {
        setHistoryCount(0);
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

  const handleClearHistory = async () => {
    await clearPersistedHistory();
    setHistoryCount(0);
  };

  const activePillTranslateX = Animated.multiply(animatedTabIndex, tabSegmentWidth);

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <View style={styles.app}>
        <View style={styles.screenHost}>
          <View style={[styles.screenLayer, activeTab !== 'home' && styles.hiddenScreen]}>
            <ExtractorScreen ref={extractorRef} onHistoryChanged={setHistoryCount} />
          </View>

          <View style={[styles.screenLayer, activeTab !== 'history' && styles.hiddenScreen]}>
            <HistoryScreen
              isActive={activeTab === 'history'}
              onSelectSession={handleSelectSession}
            />
          </View>

          <View style={[styles.screenLayer, activeTab !== 'settings' && styles.hiddenScreen]}>
            <SettingsScreen
              historyCount={historyCount}
              onClearHistory={handleClearHistory}
              onResetHome={() => extractorRef.current?.resetAll()}
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
                      <Text
                        style={[
                          styles.tabBadgeText,
                          isActive && styles.tabBadgeTextActive,
                        ]}>
                        {tab.badge}
                      </Text>
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

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#EAF0F7',
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
    backgroundColor: '#EAF0F7',
  },
  tabBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 10,
    paddingVertical: 10,
    overflow: 'hidden',
    shadowColor: '#0C2340',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 10},
    elevation: 6,
  },
  tabActivePill: {
    position: 'absolute',
    left: 10,
    top: 10,
    bottom: 10,
    borderRadius: 22,
    backgroundColor: '#0F2741',
    shadowColor: '#0C2340',
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 10},
    elevation: 4,
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
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#E7F0FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
  },
  tabBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1D5F9D',
  },
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5F7896',
  },
  tabLabelActive: {
    color: '#FFFFFF',
  },
});

export default App;
