import React from 'react';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Screen } from '@/components/common/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionCard } from '@/components/layout/SectionCard';
import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/common/AppButton';
import { AppTheme } from '@/theme';
import { ROUTES } from '@/constants/navigation';
import { useMeQuery } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { clearAuthToken } from '@/services/tokenStorage';
import { useAuthContext } from '@/context/AuthContext';
import { clearSession } from '@/store/slices/authSlice';
import { setCartState, setRole, setWishlist } from '@/store/slices/uiSlice';
import { baseApi } from '@/store/api/baseApi';
import { getAuthSession } from '@/services/tokenStorage';
import { OWNER_LOCATION, OWNER_NAME, OWNER_PHONE_DISPLAY } from '@/constants/owner';

const quickLinks = [
  { title: 'User Management', subtitle: 'Users, roles, and access', route: 'UserManagement', icon: 'account-group-outline', parentRoute: true },
  { title: 'Product Moderation', subtitle: 'Catalog review queue', route: 'ProductModeration', icon: 'shield-check-outline', parentRoute: true },
  { title: 'Seller Approvals', subtitle: 'Review applications', route: ROUTES.SellerApprovals, icon: 'store-check-outline', parentRoute: false },
  { title: 'Support Inbox', subtitle: 'Chat with customers', route: ROUTES.AdminSupportInbox, icon: 'chatbubbles-outline', parentRoute: false }
] as const;

export function AdminMoreScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { sessionReady } = useAuthContext();
  const tokenReady = Boolean(getAuthSession()?.token);
  const { data } = useMeQuery(undefined, {
    skip: !sessionReady || !tokenReady,
    refetchOnMountOrArgChange: true
  });
  const user = data?.data ?? {};
  const navigateTo = (route: string, parentRoute = false) => {
    if (parentRoute) {
      const parent = navigation.getParent?.();
      if (parent?.navigate) {
        parent.navigate(route as never);
        return;
      }
    }
    navigation.navigate(route as never);
  };

  const logout = async () => {
    await clearAuthToken();
    dispatch(clearSession());
    dispatch(setRole('shopper'));
    dispatch(setWishlist([]));
    dispatch(setCartState({}));
    dispatch(baseApi.util.resetApiState());
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.Login as never }]
    });
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader title="Admin Profile" subtitle="Utilities, shortcuts, and logout." />

        <SectionCard style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="shield-checkmark" size={28} color={AppTheme.colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="headline">{user.name ?? OWNER_NAME}</AppText>
            <AppText variant="body" tone="soft">{user.phone ?? OWNER_PHONE_DISPLAY}</AppText>
            <AppText variant="small" tone="soft">{OWNER_LOCATION}</AppText>
            <AppText variant="small" tone="soft">{user.email ?? 'Email not set'}</AppText>
          </View>
          <View style={styles.rolePill}>
            <AppText variant="small" tone="white">ADMIN</AppText>
          </View>
        </SectionCard>

        <SectionCard>
          <AppText variant="title">Quick actions</AppText>
          <View style={styles.quickGrid}>
            {quickLinks.map((item) => (
              <Pressable key={item.title} onPress={() => navigateTo(item.route as string, Boolean(item.parentRoute))} style={styles.quickCard}>
                <View style={styles.quickIcon}>
                  <MaterialCommunityIcons name={item.icon as any} size={20} color={AppTheme.colors.primary} />
                </View>
                <AppText variant="title">{item.title}</AppText>
                <AppText variant="small" tone="soft">{item.subtitle}</AppText>
              </Pressable>
            ))}
          </View>
        </SectionCard>

        <SectionCard>
          <AppText variant="title">Admin utilities</AppText>
          <View style={styles.utilityList}>
            <Pressable style={styles.utilityRow} onPress={() => navigateTo(ROUTES.RevenueAnalytics)}>
              <AppText variant="body">Revenue dashboard</AppText>
              <Ionicons name="chevron-forward" size={18} color={AppTheme.colors.primary} />
            </Pressable>
            <Pressable style={styles.utilityRow} onPress={() => navigateTo(ROUTES.OrdersOverview)}>
              <AppText variant="body">Orders overview</AppText>
              <Ionicons name="chevron-forward" size={18} color={AppTheme.colors.primary} />
            </Pressable>
          </View>
        </SectionCard>

        <AppButton title="Logout" variant="secondary" onPress={logout} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: AppTheme.spacing.md,
    gap: AppTheme.spacing.md,
    paddingBottom: AppTheme.spacing.xl
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.md
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.primary
  },
  rolePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: AppTheme.colors.primary
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm
  },
  quickCard: {
    width: '48%',
    gap: 8,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.surface
  },
  utilityList: {
    gap: AppTheme.spacing.sm
  },
  utilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: AppTheme.spacing.sm
  }
});
