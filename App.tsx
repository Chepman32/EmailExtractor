import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {ExtractorScreen} from './src/features/extractor/ExtractorScreen';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <ExtractorScreen />
    </SafeAreaProvider>
  );
}

export default App;
