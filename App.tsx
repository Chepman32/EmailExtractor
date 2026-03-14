import React, {useEffect, useRef, useState} from 'react';
import {Pressable, StatusBar, StyleSheet, Text, View} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import {clearPersistedHistory, readHistory} from './src/domain/history/historyStorage';
import {ExtractorScreen, ExtractorScreenHandle} from './src/features/extractor/ExtractorScreen';
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
  const insets = useSafeAreaInsets();
  const extractorRef = useRef<ExtractorScreenHandle>(null);
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    readHistory()
      .then(sessions => {
        setHistoryCount(sessions.length);
      })
      .catch(() => {
        setHistoryCount(0);
      });
  }, []);

  const handleSelectSession = (session: HistorySession) => {
    extractorRef.current?.loadSession(session);
    setActiveTab('home');
  };

  const handleClearHistory = async () => {
    await clearPersistedHistory();
    setHistoryCount(0);
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />

      <View style={styles.app}>
        <View style={styles.screenHost}>
          <View style={[styles.screenLayer, activeTab !== 'home' && styles.hiddenScreen]}>
            <ExtractorScreen
              ref={extractorRef}
              onHistoryChanged={setHistoryCount}
            />
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
          <View style={styles.tabBar}>
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;

              return (
                <Pressable
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  testID={`tab-${tab.id}`}
                  style={({pressed}) => [
                    styles.tabButton,
                    isActive && styles.tabButtonActive,
                    pressed && styles.tabButtonPressed,
                  ]}>
                  <View
                    style={[
                      styles.tabBadge,
                      isActive && styles.tabBadgeActive,
                    ]}>
                    <Text
                      style={[
                        styles.tabBadgeText,
                        isActive && styles.tabBadgeTextActive,
                      ]}>
                      {tab.badge}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.tabLabel,
                      isActive && styles.tabLabelActive,
                    ]}>
                    {tab.label}
                  </Text>
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
    shadowColor: '#0C2340',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 10},
    elevation: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  tabButtonActive: {
    backgroundColor: '#0F2741',
  },
  tabButtonPressed: {
    opacity: 0.92,
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
