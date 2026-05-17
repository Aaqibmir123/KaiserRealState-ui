import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/components/common/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionCard } from '@/components/layout/SectionCard';
import { AppText } from '@/components/common/AppText';
import { AppTheme } from '@/theme';
import { formatCurrency } from '@/utils/format';
import { useAppSelector } from '@/store/hooks';
import { selectAuthToken } from '@/store/slices/authSlice';
import { useGetOrdersQuery } from '@/store/api/orderApi';
import { ROUTES } from '@/constants/navigation';

const filters = ['ALL', 'PLACED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const;

const toneForStatus = (status?: string) => {
  switch (String(status ?? '').toUpperCase()) {
    case 'DELIVERED':
      return 'success';
    case 'CANCELLED':
      return 'danger';
    case 'SHIPPED':
      return 'info';
    case 'PACKED':
    case 'PLACED':
      return 'primary';
    default:
      return 'default';
  }
};

const formatDate = (value?: string | Date | null) => {
  if (!value) return 'Just now';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Just now';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export function MyOrdersScreen({ navigation }: any) {
  const token = useAppSelector(selectAuthToken);
  const { data, isLoading, isFetching, refetch } = useGetOrdersQuery(undefined, { skip: !token, refetchOnFocus: true, refetchOnReconnect: true });
  const [filter, setFilter] = useState<(typeof filters)[number]>('ALL');

  const orders = data ?? [];

  const stats = useMemo(() => ({
    total: orders.length,
    active: orders.filter((item: any) => ['PLACED', 'PACKED', 'SHIPPED'].includes(String(item.status))).length,
    delivered: orders.filter((item: any) => String(item.status) === 'DELIVERED').length,
    returned: orders.filter((item: any) => (item.returnRequests ?? []).length).length
  }), [orders]);

  const visibleOrders = useMemo(() => {
    if (filter === 'ALL') return orders;
    return orders.filter((item: any) => String(item.status) === filter);
  }, [filter, orders]);

  return (
    <Screen>
      <PageHeader title="My Orders" subtitle="Track shipments, view receipts, and start returns when eligible." />
      <FlatList
        data={visibleOrders}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshing={isLoading || isFetching}
        onRefresh={refetch}
        ListHeaderComponent={
          <View style={styles.header}>
            <SectionCard style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <AppText variant="small" tone="soft">Orders</AppText>
                  <AppText variant="headline">{stats.total}</AppText>
                </View>
                <View style={styles.summaryItem}>
                  <AppText variant="small" tone="soft">Active</AppText>
                  <AppText variant="headline">{stats.active}</AppText>
                </View>
                <View style={styles.summaryItem}>
                  <AppText variant="small" tone="soft">Delivered</AppText>
                  <AppText variant="headline">{stats.delivered}</AppText>
                </View>
                <View style={styles.summaryItem}>
                  <AppText variant="small" tone="soft">Returns</AppText>
                  <AppText variant="headline">{stats.returned}</AppText>
                </View>
              </View>
              <View style={styles.filterRow}>
                {filters.map((item) => {
                  const active = item === filter;
                  return (
                    <Pressable
                      key={item}
                      onPress={() => setFilter(item)}
                      style={[styles.filterChip, active && styles.filterChipActive]}
                    >
                      <AppText variant="small" tone={active ? 'white' : 'soft'}>{item}</AppText>
                    </Pressable>
                  );
                })}
              </View>
            </SectionCard>

            <SectionCard style={styles.tipsCard}>
              <View style={styles.tipRow}>
                <Ionicons name="time-outline" size={18} color={AppTheme.colors.primary} />
                <AppText variant="body" tone="soft">Seller updates order status manually from Placed to Delivered.</AppText>
              </View>
              <View style={styles.tipRow}>
                <Ionicons name="return-up-forward-outline" size={18} color={AppTheme.colors.primary} />
                <AppText variant="body" tone="soft">Returns and replacements open after delivery and within the return window.</AppText>
              </View>
            </SectionCard>
          </View>
        }
        ListEmptyComponent={
          <SectionCard style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons name="receipt-outline" size={24} color={AppTheme.colors.primary} />
            </View>
            <AppText variant="headline">No orders yet</AppText>
            <AppText variant="body" tone="soft" style={styles.centerText}>
              Once you place an order, it will show up here with live status and receipts.
            </AppText>
          </SectionCard>
        }
        renderItem={({ item }: any) => {
          const firstReturn = (item.returnRequests ?? [])[0];
          return (
            <Pressable
              onPress={() => navigation.navigate(ROUTES.OrderDetail, { orderId: item.id })}
              style={({ pressed }) => [styles.orderCard, pressed && styles.pressed]}
            >
              <View style={styles.orderHeader}>
                <View style={styles.orderAvatar}>
                  <Ionicons name="cube-outline" size={22} color={AppTheme.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.orderHeaderRow}>
                    <AppText variant="title" numberOfLines={1}>Order {item.number ?? item.id}</AppText>
                    <View style={[styles.statusPill, toneForStatus(item.status) === 'success' && styles.statusSuccess, toneForStatus(item.status) === 'danger' && styles.statusDanger, toneForStatus(item.status) === 'info' && styles.statusInfo]}>
                      <AppText variant="small" tone="white">{String(item.status ?? 'PLACED').replace('_', ' ')}</AppText>
                    </View>
                  </View>
                  <AppText variant="body" tone="soft" numberOfLines={1}>
                    {item.addressName ?? 'Customer'} • {item.addressCity ?? 'City'}
                  </AppText>
                </View>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <AppText variant="small" tone="soft">Placed</AppText>
                  <AppText variant="label">{formatDate(item.createdAt)}</AppText>
                </View>
                <View style={styles.metaItem}>
                  <AppText variant="small" tone="soft">Amount</AppText>
                  <AppText variant="label" tone="primary">{formatCurrency(Number(item.total ?? 0))}</AppText>
                </View>
                <View style={styles.metaItem}>
                  <AppText variant="small" tone="soft">Items</AppText>
                  <AppText variant="label">{item.items?.length ?? 0}</AppText>
                </View>
              </View>

              <View style={styles.badgeRow}>
                <View style={styles.badge}><AppText variant="small" tone="soft">{item.paymentMethod ?? 'Payment'}</AppText></View>
                <View style={styles.badge}><AppText variant="small" tone="soft">{item.items?.[0]?.size ? `Size ${item.items[0].size}` : 'Size not set'}</AppText></View>
                <View style={styles.badge}><AppText variant="small" tone="soft">{item.items?.[0]?.color ?? 'Color pending'}</AppText></View>
                {firstReturn ? <View style={styles.returnBadge}><AppText variant="small" tone="white">{String(firstReturn.status).replace('_', ' ')}</AppText></View> : null}
              </View>
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: AppTheme.spacing.md,
    gap: AppTheme.spacing.md,
    paddingBottom: AppTheme.spacing.xl + 80
  },
  header: {
    gap: AppTheme.spacing.md
  },
  summaryCard: {
    gap: AppTheme.spacing.md
  },
  summaryRow: {
    flexDirection: 'row',
    gap: AppTheme.spacing.sm
  },
  summaryItem: {
    flex: 1,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm
  },
  filterChip: {
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  filterChipActive: {
    backgroundColor: AppTheme.colors.primary
  },
  tipsCard: {
    gap: AppTheme.spacing.sm
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: AppTheme.spacing.sm
  },
  emptyCard: {
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
    paddingVertical: AppTheme.spacing.xl
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.primaryContainer
  },
  centerText: {
    textAlign: 'center'
  },
  orderCard: {
    gap: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.lg,
    padding: AppTheme.spacing.md,
    ...AppTheme.shadow.card
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }]
  },
  orderHeader: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
    alignItems: 'center'
  },
  orderAvatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.primaryContainer
  },
  orderHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: AppTheme.spacing.sm
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: AppTheme.colors.primary
  },
  statusSuccess: {
    backgroundColor: AppTheme.colors.success
  },
  statusDanger: {
    backgroundColor: AppTheme.colors.danger
  },
  statusInfo: {
    backgroundColor: AppTheme.colors.info
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: AppTheme.spacing.sm
  },
  metaItem: {
    flex: 1
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm
  },
  badge: {
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 8,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  returnBadge: {
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 8,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: AppTheme.colors.primaryStrong
  }
});
