import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/components/common/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionCard } from '@/components/layout/SectionCard';
import { AppText } from '@/components/common/AppText';
import { AppTheme } from '@/theme';
import { formatCurrency } from '@/utils/format';
import { BuyDeal, SellDeal } from './landDealTypes';
import { DealCard } from './DealCard';

export function LandDealManagementScreen() {
  const { width } = useWindowDimensions();
  const stacked = width < 720;
  const [buyDeals, setBuyDeals] = useState<BuyDeal[]>([]);
  const [sellDeals, setSellDeals] = useState<SellDeal[]>([]);
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell' | 'open' | 'closed'>('all');

  const buyCount = buyDeals.length;
  const closedCount = buyDeals.filter((item) => item.isClosed).length;
  const profit = useMemo(
    () =>
      sellDeals.reduce((sum, sell) => {
        const source = buyDeals.find((item) => item.id === sell.sourceBuyId);
        return sum + Math.max(0, Number(sell.sellPrice || 0) - Number(source?.purchasePrice || 0));
      }, 0),
    [buyDeals, sellDeals]
  );
  const allDeals = useMemo(() => {
    const buys = buyDeals.map((item) => ({
      id: item.id,
      kind: 'buy' as const,
      closed: item.isClosed,
      createdAt: item.createdAt,
      title: item.title,
      location: item.location,
      amount: item.purchasePrice,
      source: item
    }));
    const sells = sellDeals.map((item) => {
      const source = buyDeals.find((buy) => buy.id === item.sourceBuyId) ?? null;
      return {
        id: item.id,
        kind: 'sell' as const,
        closed: item.dealClosed,
        createdAt: item.createdAt,
        title: source?.title ?? 'Sold land',
        location: source?.location ?? item.soldToLocation,
        amount: item.sellPrice,
        source,
        sell: item
      };
    });

    return [...sells, ...buys].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [buyDeals, sellDeals]);

  const filteredDeals = useMemo(() => {
    if (filter === 'all') return allDeals;
    if (filter === 'buy') return allDeals.filter((item) => item.kind === 'buy');
    if (filter === 'sell') return allDeals.filter((item) => item.kind === 'sell');
    if (filter === 'open') return allDeals.filter((item) => !item.closed);
    return allDeals.filter((item) => item.closed);
  }, [allDeals, filter]);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader title="Deals" subtitle="See buy and sell deals together. Use filters to narrow the list." />

        <LinearGradient colors={['#0B5A43', '#0D6A4D']} style={styles.hero}>
          <View style={styles.heroRow}>
            <View style={styles.heroStat}><AppText variant="small" tone="white">Buy records</AppText><AppText variant="headline" tone="white">{buyCount}</AppText></View>
            <View style={styles.heroStat}><AppText variant="small" tone="white">Closed deals</AppText><AppText variant="headline" tone="white">{closedCount}</AppText></View>
            <View style={styles.heroStat}><AppText variant="small" tone="white">Profit</AppText><AppText variant="headline" tone="white">{formatCurrency(profit)}</AppText></View>
          </View>
        </LinearGradient>

        <SectionCard style={styles.switchCard}>
          <View style={styles.switchRow}>
            {(['all', 'buy', 'sell', 'open', 'closed'] as const).map((item) => (
              <Pressable key={item} onPress={() => setFilter(item)} style={[styles.switchChip, filter === item && styles.switchChipActive]}>
                <AppText variant="small" tone={filter === item ? 'white' : 'soft'}>
                  {item === 'all' ? 'All deals' : item === 'buy' ? 'Buy' : item === 'sell' ? 'Sell' : item === 'open' ? 'Open' : 'Closed'}
                </AppText>
              </Pressable>
            ))}
          </View>
        </SectionCard>

        <SectionCard style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AppText variant="title">All deals</AppText>
            <AppText variant="small" tone="soft">{filteredDeals.length} records</AppText>
          </View>
          {filteredDeals.length ? filteredDeals.map((item) => (
            <DealCard
              key={`${item.kind}-${item.id}`}
              deal={item.kind === 'buy' ? item.source : item.sell}
              mode={item.kind}
              source={item.kind === 'sell' ? item.source : undefined}
              stacked={stacked}
              readOnly
            />
          )) : (
            <View style={styles.emptyState}><Ionicons name="albums-outline" size={28} color={AppTheme.colors.primary} /><AppText variant="headline" style={{ marginTop: 12 }}>No deals yet</AppText><AppText variant="body" tone="soft" style={styles.centerText}>Buy and sell records will appear here once they are created.</AppText></View>
          )}
        </SectionCard>
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
  hero: {
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.lg,
    gap: AppTheme.spacing.md
  },
  heroRow: { flexDirection: 'row', gap: AppTheme.spacing.sm },
  heroStat: { flex: 1, padding: AppTheme.spacing.sm, borderRadius: AppTheme.radius.md, backgroundColor: 'rgba(255,255,255,0.12)' },
  switchCard: { gap: AppTheme.spacing.sm },
  switchRow: { flexDirection: 'row', gap: AppTheme.spacing.sm },
  switchChip: { paddingHorizontal: AppTheme.spacing.md, paddingVertical: AppTheme.spacing.sm, borderRadius: AppTheme.radius.pill, backgroundColor: AppTheme.colors.surfaceSoft },
  switchChipActive: { backgroundColor: AppTheme.colors.primary },
  sectionCard: { gap: AppTheme.spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: AppTheme.spacing.sm },
  emptyState: { alignItems: 'center', paddingVertical: AppTheme.spacing.xl },
  centerText: { textAlign: 'center', marginTop: 8 }
});
