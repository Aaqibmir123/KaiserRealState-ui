import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppText } from '../common/AppText';
import { Category } from '@/types/models';
import { AppTheme } from '@/theme';

type Props = {
  category: Category;
  onPress?: () => void;
};

export function CategoryPill({ category, onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <View style={[styles.iconWrap, { backgroundColor: category.tint }]}>
        <MaterialCommunityIcons name={category.icon as never} size={24} color={AppTheme.colors.primary} />
      </View>
      <AppText variant="small" tone="soft">{category.name}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8, width: 72 },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
