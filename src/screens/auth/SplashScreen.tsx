import React, { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSelector } from '@/store/hooks';

import { Screen } from '@/components/common/Screen';
import { AppText } from '@/components/common/AppText';
import { AppTheme } from '@/theme';
import { ROUTES } from '@/constants/navigation';
import { selectAuthHydrated, selectAuthRole, selectAuthToken } from '@/store/slices/authSlice';
import { getAuthSession } from '@/services/tokenStorage';

type Props = any;

export function SplashScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const hydrated = useAppSelector(selectAuthHydrated);
  const token = useAppSelector(selectAuthToken);
  const role = useAppSelector(selectAuthRole);

  useEffect(() => {
    if (!hydrated) return;
    const id = setTimeout(() => {
      const session = getAuthSession();
      if (!token) {
        navigation.replace(ROUTES.Login);
        return;
      }

      if (role === 'admin') {
        navigation.replace(ROUTES.AdminStack);
        return;
      }

      if (role === 'seller') {
        navigation.replace(ROUTES.SellerStack);
        return;
      }

      navigation.replace(ROUTES.MainTabs);
    }, 450);

    return () => clearTimeout(id);
  }, [hydrated, navigation, role, token]);

  return (
    <Screen>
      <LinearGradient colors={['#FFF8F6', '#FFE6DA', '#FFFDFB']} style={styles.wrap}>
        <View style={[styles.orb, styles.orbA]} />
        <View style={[styles.orb, styles.orbB]} />
        <View style={[styles.logoCard, width >= 768 && styles.logoCardWide]}>
          <View style={styles.logoRing}>
            <AppText variant="display" tone="primary">Shopora</AppText>
          </View>
          <AppText variant="title" tone="soft" style={styles.tagline}>
            Premium marketplace for shoppers, sellers, and admins
          </AppText>
          <View style={styles.loaderRow}>
            <ActivityIndicator size="small" color={AppTheme.colors.primary} />
            <AppText variant="small" tone="soft">Opening your secure workspace...</AppText>
          </View>
        </View>
      </LinearGradient>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: AppTheme.spacing.md,
    overflow: 'hidden'
  },
  orb: {
    position: 'absolute',
    borderRadius: 999
  },
  orbA: {
    width: 180,
    height: 180,
    backgroundColor: 'rgba(255,255,255,0.45)',
    top: 48,
    right: -40
  },
  orbB: {
    width: 220,
    height: 220,
    backgroundColor: 'rgba(255,255,255,0.28)',
    bottom: -60,
    left: -60
  },
  logoCard: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    justifyContent: 'center',
    gap: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.xl,
    paddingHorizontal: AppTheme.spacing.lg
  },
  logoCardWide: {
    maxWidth: 520
  },
  logoRing: {
    width: 210,
    height: 210,
    borderRadius: 105,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.62)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8
  },
  tagline: {
    textAlign: 'center',
    marginTop: AppTheme.spacing.sm,
    maxWidth: 360
  },
  loaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: AppTheme.spacing.sm,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: 10,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: 'rgba(255,255,255,0.58)'
  }
});
