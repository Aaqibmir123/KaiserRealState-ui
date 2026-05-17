import React from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppText } from './AppText';
import { SectionCard } from '@/components/layout/SectionCard';
import { AppTheme } from '@/theme';
import { Testimonial } from '@/types/models';

const stars = [1, 2, 3, 4, 5];

export function TestimonialCard({
  item,
  readOnly = false,
  stacked = false,
  onEdit,
  onDelete
}: {
  item: Testimonial;
  readOnly?: boolean;
  stacked?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const initials = item.clientName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');

  return (
    <SectionCard style={[styles.card, stacked && styles.cardStacked]}>
      <View style={styles.topRow}>
        <View style={styles.identity}>
          <View style={styles.photo}>
            {item.photoUrl ? (
              <Image source={{ uri: item.photoUrl }} style={styles.photoImage} contentFit="cover" />
            ) : (
              <AppText variant="title">{initials || 'T'}</AppText>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <AppText variant="title" numberOfLines={1}>{item.clientName}</AppText>
            <View style={styles.ratingRow}>
              {stars.map((star) => (
                <Ionicons
                  key={star}
                  name={star <= item.rating ? 'star' : 'star-outline'}
                  size={14}
                  color={star <= item.rating ? '#F4B400' : AppTheme.colors.textSoft}
                />
              ))}
            </View>
          </View>
        </View>

        {!readOnly ? (
          <View style={styles.actionRow}>
            <Pressable style={styles.iconButton} onPress={onEdit}>
              <Ionicons name="create-outline" size={16} color={AppTheme.colors.primary} />
            </Pressable>
            <Pressable style={styles.iconButton} onPress={onDelete}>
              <Ionicons name="trash-outline" size={16} color={AppTheme.colors.danger} />
            </Pressable>
          </View>
        ) : null}
      </View>

      <AppText variant="body" tone="soft" numberOfLines={4}>
        {item.feedback}
      </AppText>

      <View style={styles.metaRow}>
        <AppText variant="small" tone="soft">{item.location || 'Client review'}</AppText>
        {item.purchaseDate ? <AppText variant="small" tone="soft">{item.purchaseDate}</AppText> : null}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: AppTheme.spacing.sm
  },
  cardStacked: {
    gap: AppTheme.spacing.sm
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: AppTheme.spacing.md,
    alignItems: 'flex-start'
  },
  identity: {
    flex: 1,
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
    alignItems: 'center'
  },
  photo: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: AppTheme.colors.surfaceSoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  photoImage: {
    width: '100%',
    height: '100%'
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 4
  },
  actionRow: {
    flexDirection: 'row',
    gap: AppTheme.spacing.sm,
    alignItems: 'center'
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: AppTheme.radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: AppTheme.spacing.md
  }
});
