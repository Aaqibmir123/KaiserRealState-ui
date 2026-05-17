import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { store } from '@/store/store';
import { RootNavigator } from '@/navigation/RootNavigator';
import { FeedbackToast } from '@/components/common/FeedbackToast';
import { processOfflineQueue, registerDefaultOfflineHandlers } from '@/services/offlineQueue';
import { AppText } from '@/components/common/AppText';
import { AppTheme } from '@/theme';
import { AuthProvider, useAuthContext } from '@/context/AuthContext';

function OfflineBootstrap() {
  useEffect(() => {
    registerDefaultOfflineHandlers();
    void processOfflineQueue();
    const timer = setInterval(() => {
      void processOfflineQueue();
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  return null;
}

function BootSplash() {
  return (
    <View style={styles.bootWrap}>
      <LinearGradient colors={['#FFF8F6', '#FFE7DB']} style={styles.bootGradient}>
        <View style={styles.bootLogo}>
          <AppText variant="display" tone="primary">Shopora</AppText>
        </View>
        <AppText variant="title" tone="soft" style={styles.bootText}>Loading your secure session...</AppText>
      </LinearGradient>
    </View>
  );
}

function AppShell() {
  const { sessionReady } = useAuthContext();

  if (!sessionReady) {
    return <BootSplash />;
  }

  return (
    <NavigationContainer theme={DefaultTheme}>
      <StatusBar style="dark" />
      <RootNavigator />
      <FeedbackToast />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <AuthProvider>
            <OfflineBootstrap />
            <AppShell />
          </AuthProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  bootWrap: {
    flex: 1
  },
  bootGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  bootLogo: {
    width: 220,
    height: 220,
    borderRadius: 110,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)'
  },
  bootText: {
    marginTop: AppTheme.spacing.md
  }
});
