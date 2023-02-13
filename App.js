/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  BackHandler,
  Alert,
  AppState,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { AppStack } from './app/src/routes/AppStack';
import AppContextProvider from './app/themes/AppContextProvider';
import Toast from "react-native-toast-message";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { store } from './app/src/store'
import { Provider } from 'react-redux';
import './i18n';
import FlashMessage from "react-native-flash-message";
import NeoNetworkState from './app/src/components/base/network_state_component'
const App = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  Text.defaultProps = Text.defaultProps || {}

  Text.defaultProps.allowFontScaling = false
  return (
    <Provider store={store}>
      <AppContextProvider>
        <FlashMessage position="top" duration={2000} animated={true} />
        <SafeAreaView style={{ flex: 1 }}>
          <NeoNetworkState />
          <AppStack />
          <Toast />

        </SafeAreaView>
      </AppContextProvider>
    </Provider>
  );
};


export default App;
