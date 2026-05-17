import React from 'react';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { AppTheme } from '@/theme';

export function LandDealMediaGrid({
  items,
  compact = false
}: {
  items: Array<{ label: string; uri?: string | null }>;
  compact?: boolean;
}) {
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={[styles.tile, compact && styles.tileCompact]}>
          <View style={styles.tileHeader}>
            <AppText variant="small" tone="soft">{item.label}</AppText>
            <Ionicons name="images-outline" size={14} color={AppTheme.colors.primary} />
          </View>
          {item.uri ? (
            <Image source={{ uri: item.uri }} style={styles.image} contentFit="cover" />
          ) : (
            <View style={styles.empty}>
              <Ionicons name="image-outline" size={22} color={AppTheme.colors.primary} />
              <AppText variant="small" tone="soft">No image</AppText>
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm
  },
  tile: {
    flex: 1,
    minWidth: 150,
    padding: AppTheme.spacing.sm,
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.surfaceSoft,
    gap: 8
  },
  tileCompact: {
    minWidth: 120
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  image: {
    height: 92,
    borderRadius: AppTheme.radius.sm,
    backgroundColor: AppTheme.colors.surface
  },
  empty: {
    height: 92,
    borderRadius: AppTheme.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: AppTheme.colors.surface
  }
});
