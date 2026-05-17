import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from '@/components/common/AppText';
import { SectionCard } from '@/components/layout/SectionCard';
import { AppTheme } from '@/theme';
import { formatCurrency } from '@/utils/format';
import { BuyDeal, SellDeal } from './landDealTypes';
import { LandDealMediaGrid } from './LandDealMediaGrid';

export function DealCard({
  deal,
  mode,
  source,
  onEdit,
  onDelete,
  onToggleClosed,
  readOnly = false,
  stacked = false
}: {
  deal: BuyDeal | SellDeal;
  mode: 'buy' | 'sell';
  source?: BuyDeal | null;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleClosed?: () => void;
  readOnly?: boolean;
  stacked?: boolean;
}) {
  const title = mode === 'buy' ? (deal as BuyDeal).title : source?.title ?? 'Sold land';
  const location = mode === 'buy' ? (deal as BuyDeal).location : source?.location ?? 'Linked property';
  const mainPrice = mode === 'buy' ? Number((deal as BuyDeal).purchasePrice || 0) : Number((deal as SellDeal).sellPrice || 0);
  const profit = mode === 'sell' && source ? Number((deal as SellDeal).sellPrice || 0) - Number(source.purchasePrice || 0) : null;

  return (
    <SectionCard style={styles.card}>
      <View style={[styles.cardTop, stacked && styles.cardTopStacked]}>
        <View style={styles.cardMeta}>
          <View style={styles.titleRow}>
            <AppText variant="title" numberOfLines={2}>{title}</AppText>
            <View style={[styles.badge, mode === 'buy' ? styles.buyBadge : styles.sellBadge]}>
              <AppText variant="small" tone="white">{mode === 'buy' ? 'BUY' : 'SELL'}</AppText>
            </View>
          </View>
          <AppText variant="body" tone="soft" numberOfLines={2}>
            {location} - {formatCurrency(mainPrice)}
          </AppText>
          <AppText variant="small" tone="soft">
            {mode === 'buy'
              ? `Purchased from: ${(deal as BuyDeal).purchasedFromName} - Phone: ${(deal as BuyDeal).purchasedFromPhone} - Date: ${(deal as BuyDeal).purchaseDate}`
              : `Sold to: ${(deal as SellDeal).soldToName} - Phone: ${(deal as SellDeal).soldToPhone} - Location: ${(deal as SellDeal).soldToLocation}`}
          </AppText>
          {mode === 'sell' ? (
            <AppText variant="small" tone="soft">
              Date: {(deal as SellDeal).sellDate} - Profit: {formatCurrency(Math.max(0, profit ?? 0))}
            </AppText>
          ) : null}
        </View>

        {!readOnly ? (
          <View style={styles.actionRow}>
            {mode === 'buy' ? (
              <Pressable style={[styles.statusPill, (deal as BuyDeal).isClosed ? styles.closedPill : styles.openPill]} onPress={onToggleClosed}>
                <AppText variant="small" tone="white">{(deal as BuyDeal).isClosed ? 'Closed' : 'Open'}</AppText>
              </Pressable>
            ) : null}
            <Pressable style={styles.iconButton} onPress={onEdit}>
              <Ionicons name="create-outline" size={16} color={AppTheme.colors.primary} />
            </Pressable>
            <Pressable style={styles.iconButton} onPress={onDelete}>
              <Ionicons name="trash-outline" size={16} color={AppTheme.colors.danger} />
            </Pressable>
          </View>
        ) : null}
      </View>

      <LandDealMediaGrid
        items={[
          { label: 'Land photo', uri: (deal as BuyDeal).landImage ?? source?.landImage ?? undefined },
          { label: 'Aadhaar card', uri: (deal as BuyDeal).aadhaarCardImage ?? source?.aadhaarCardImage ?? undefined },
          { label: 'Geo tag', uri: (deal as BuyDeal).geoTagImage ?? source?.geoTagImage ?? undefined },
          ...(mode === 'sell' ? [{ label: 'Buyer Aadhaar', uri: (deal as SellDeal).soldToAadhaarImage ?? undefined }] : [])
        ]}
      />

      <View style={styles.detailRow}>
        <View style={styles.detailChip}>
          <AppText variant="small" tone="soft">Area</AppText>
          <AppText variant="label">{mode === 'buy' ? (deal as BuyDeal).areaSize : source?.areaSize ?? '-'}</AppText>
        </View>
        <View style={styles.detailChip}>
          <AppText variant="small" tone="soft">Status</AppText>
          <AppText variant="label">{mode === 'buy' ? ((deal as BuyDeal).isClosed ? 'Deal closed' : 'Deal open') : (source ? 'From buy record' : '-')}</AppText>
        </View>
        {mode === 'sell' ? (
          <View style={styles.detailChip}>
            <AppText variant="small" tone="soft">Buyer Aadhaar</AppText>
            <AppText variant="label">{(deal as SellDeal).soldToAadhaarNumber || 'Not added'}</AppText>
          </View>
        ) : null}
        <View style={styles.detailChip}>
          <AppText variant="small" tone="soft">{mode === 'buy' ? 'Purchase price' : 'Sell price'}</AppText>
          <AppText variant="label">{formatCurrency(mainPrice)}</AppText>
        </View>
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: AppTheme.spacing.md
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: AppTheme.spacing.md
  },
  cardTopStacked: {
    flexDirection: 'column'
  },
  cardMeta: {
    flex: 1,
    gap: AppTheme.spacing.xs
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: AppTheme.spacing.sm
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: AppTheme.radius.pill
  },
  buyBadge: {
    backgroundColor: AppTheme.colors.primary
  },
  sellBadge: {
    backgroundColor: AppTheme.colors.primaryStrong
  },
  actionRow: {
    flexDirection: 'row',
    gap: AppTheme.spacing.sm,
    alignItems: 'center'
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: AppTheme.radius.pill
  },
  closedPill: {
    backgroundColor: AppTheme.colors.textSoft
  },
  openPill: {
    backgroundColor: AppTheme.colors.primary
  },
  iconButton: {
    minWidth: 42,
    height: 42,
    paddingHorizontal: 12,
    borderRadius: AppTheme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm
  },
  detailChip: {
    flex: 1,
    minWidth: 120,
    padding: AppTheme.spacing.sm,
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.surfaceSoft
  }
});
