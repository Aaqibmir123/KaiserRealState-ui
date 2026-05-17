import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Screen } from '@/components/common/Screen';
import { AppText } from '@/components/common/AppText';
import { StatCard } from '@/components/common/StatCard';
import { SectionCard } from '@/components/layout/SectionCard';
import { AppTheme } from '@/theme';
import { useGetSellerDashboardQuery } from '@/store/api/sellerApi';
import { formatCurrency } from '@/utils/format';

const quickActions = [
  { label: 'Create', icon: 'plus-box-outline', route: 'AddProduct', note: 'New item' },
  { label: 'Catalog', icon: 'cube-outline', route: 'AllProducts', note: 'All items' },
  { label: 'Stock', icon: 'layers-outline', route: 'Inventory', note: 'Levels' },
  { label: 'Orders', icon: 'clipboard-text-outline', route: 'Orders', note: 'Track' }
] as const;

const getRestockLabel = (count: number) => {
  if (count === 0) return 'All products healthy';
  if (count === 1) return '1 product needs attention';
  return `${count} products need restock`;
};

export function SellerDashboardScreen({ navigation }: any) {
  const { data } = useGetSellerDashboardQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true
  });

  const payload = data?.data ?? data ?? {};
  const stats = payload.stats ?? {};
  const products = payload.products ?? [];
  const lowStockProducts = useMemo(() => products.filter((item: any) => item.stock > 0 && item.stock <= 5), [products]);
  const outOfStockProducts = useMemo(() => products.filter((item: any) => item.stock === 0), [products]);

  const openAddProduct = () => {
    const tabNavigation = navigation.getParent?.();
    const stackNavigation = tabNavigation?.getParent?.();
    if (stackNavigation?.navigate) {
      stackNavigation.navigate('AddProduct');
      return;
    }
    if (tabNavigation?.navigate) {
      tabNavigation.navigate('AddProduct');
      return;
    }
    navigation.navigate('AddProduct');
  };

  const openCatalog = () => {
    const tabNavigation = navigation.getParent?.();
    const stackNavigation = tabNavigation?.getParent?.();
    const rootNavigation = stackNavigation?.getParent?.();
    if (rootNavigation?.navigate) {
      rootNavigation.navigate('SellerAllProducts');
      return;
    }
    if (stackNavigation?.navigate) {
      stackNavigation.navigate('SellerAllProducts');
      return;
    }
    if (tabNavigation?.navigate) {
      tabNavigation.navigate('SellerAllProducts');
      return;
    }
    navigation.navigate('SellerAllProducts');
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topArea}>
          <View style={styles.topIcon}>
            <MaterialCommunityIcons name="storefront-outline" size={22} color={AppTheme.colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="small" tone="soft">Seller Home</AppText>
            <AppText variant="headline">Manage your store</AppText>
            <AppText variant="body" tone="soft">Catalog, inventory, orders, and earnings in one workspace.</AppText>
          </View>
        </View>

        {lowStockProducts.length ? (
          <SectionCard style={styles.alertCard}>
            <View style={styles.alertHeader}>
              <View style={styles.alertIcon}>
                <MaterialCommunityIcons name="alert-outline" size={20} color={AppTheme.colors.danger} />
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="title">Low stock alert</AppText>
                <AppText variant="small" tone="soft">{getRestockLabel(lowStockProducts.length)}</AppText>
              </View>
            </View>
            <View style={styles.alertList}>
              {lowStockProducts.slice(0, 3).map((item: any) => (
                <View key={item.id} style={styles.alertRow}>
                  <AppText variant="small">{item.title}</AppText>
                  <AppText variant="small" tone="primary">{item.stock} left</AppText>
                </View>
              ))}
              {outOfStockProducts.length ? (
                <AppText variant="small" tone="soft">{outOfStockProducts.length} out of stock items need immediate attention.</AppText>
              ) : null}
            </View>
          </SectionCard>
        ) : null}

        <View style={styles.statsRow}>
          <StatCard label="Revenue" value={formatCurrency(stats.revenue ?? 0)} />
          <StatCard label="Products" value={String(stats.productCount ?? 0)} />
          <StatCard label="Inventory" value={String(stats.inventory ?? 0)} />
          <StatCard label="Approvals" value={String(stats.approvals ?? 0)} />
        </View>

        <View style={styles.sectionHeader}>
          <AppText variant="title">Quick actions</AppText>
          <AppText variant="small" tone="soft">Fast access to day-to-day seller tasks</AppText>
        </View>
        <View style={styles.quickGrid}>
          {quickActions.map((item) => (
            <Pressable
              key={item.label}
              style={styles.quickCard}
              onPress={() => {
                if (item.route === 'AddProduct') {
                  openAddProduct();
                  return;
                }
                if (item.route === 'AllProducts') {
                  openCatalog();
                  return;
                }
                navigation.navigate(item.route);
              }}
            >
              <View style={styles.quickIcon}>
                <MaterialCommunityIcons name={item.icon as never} size={22} color={AppTheme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="label" numberOfLines={1}>{item.label}</AppText>
                <AppText variant="small" tone="soft">{item.note}</AppText>
              </View>
            </Pressable>
          ))}
        </View>

      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: AppTheme.spacing.md,
    gap: AppTheme.spacing.lg,
    paddingBottom: AppTheme.spacing.xl + 96
  },
  topArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm
  },
  topIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.primaryContainer
  },
  alertCard: {
    gap: AppTheme.spacing.sm,
    backgroundColor: '#FFF6F1'
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.md
  },
  alertIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE3DA'
  },
  alertList: {
    gap: AppTheme.spacing.xs
  },
  alertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: AppTheme.spacing.md,
    paddingVertical: 4
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.md
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.md,
    justifyContent: 'space-between',
    alignItems: 'stretch'
  },
  sectionHeader: {
    gap: 4
  },
  quickCard: {
    flexBasis: '48%',
    flexGrow: 1,
    minWidth: 0,
    minHeight: 82,
    paddingVertical: AppTheme.spacing.sm,
    paddingHorizontal: AppTheme.spacing.sm,
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.surface,
    gap: 6,
    alignItems: 'flex-start',
    ...AppTheme.shadow.card
  },
  quickIcon: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.primaryContainer
  },
});
