import React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/components/common/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionCard } from '@/components/layout/SectionCard';
import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/common/AppButton';
import { AppTheme } from '@/theme';
import { ROUTES } from '@/constants/navigation';

const coupons = [
  { code: 'WELCOME10', title: 'Welcome Bonus', description: '10% off up to ₹150 on your first big order.', tone: 'success' as const },
  { code: 'SAVE200', title: 'Big Basket', description: 'Flat ₹200 off on eligible orders above ₹1499.', tone: 'primary' as const },
  { code: 'FREESHIP', title: 'Free Shipping', description: 'Pay zero shipping fee on your order.', tone: 'info' as const }
];

type Props = any;

export function CouponsScreen({ navigation }: Props) {
  return (
    <Screen>
      <PageHeader title="Coupons" subtitle="Explore offers and use them directly in checkout." />
      <FlatList
        data={coupons}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <SectionCard style={styles.hero}>
            <View style={styles.heroIcon}>
              <Ionicons name="pricetag-outline" size={24} color={AppTheme.colors.white} />
            </View>
            <AppText variant="headline">Active offers</AppText>
            <AppText variant="body" tone="soft" style={styles.center}>
              Pick a coupon here or apply it from checkout when you are ready to place the order.
            </AppText>
          </SectionCard>
        }
        renderItem={({ item }) => (
          <SectionCard style={styles.couponCard}>
            <View style={styles.topRow}>
              <View style={[styles.codeBadge, item.tone === 'success' && styles.success, item.tone === 'info' && styles.info, item.tone === 'primary' && styles.primary]}>
                <AppText variant="label" tone="white">{item.code}</AppText>
              </View>
              <View style={styles.dotRow}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
            </View>
            <AppText variant="title">{item.title}</AppText>
            <AppText variant="body" tone="soft">{item.description}</AppText>
          <AppButton
            title="Use in Checkout"
            variant="secondary"
            onPress={() => navigation.navigate(ROUTES.Checkout, { couponCode: item.code })}
          />
        </SectionCard>
      )}
    />
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
    alignItems: 'center',
    gap: AppTheme.spacing.sm
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.primary
  },
  center: {
    textAlign: 'center'
  },
  couponCard: {
    gap: AppTheme.spacing.sm
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  codeBadge: {
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 6,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: AppTheme.colors.primary
  },
  primary: {
    backgroundColor: AppTheme.colors.primary
  },
  success: {
    backgroundColor: AppTheme.colors.success
  },
  info: {
    backgroundColor: AppTheme.colors.info
  },
  dotRow: {
    flexDirection: 'row',
    gap: 4
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppTheme.colors.border
  }
});
