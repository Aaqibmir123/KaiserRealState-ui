import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TextInput, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/components/common/Screen';
import { ProductCard } from '@/components/product/ProductCard';
import { products } from '@/data/mock';
import { AppTheme } from '@/theme';
import { EmptyState } from '@/components/layout/EmptyState';

export function SearchScreen() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => products.filter((item) => item.title.toLowerCase().includes(query.toLowerCase())), [query]);

  return (
    <Screen>
      <View style={styles.search}>
        <Ionicons name="search" size={18} color={AppTheme.colors.textSoft} />
        <TextInput value={query} onChangeText={setQuery} placeholder="Search products..." style={styles.input} placeholderTextColor={AppTheme.colors.textSoft + '88'} />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <View style={styles.item}><ProductCard item={item} compact /></View>}
        ListEmptyComponent={(
          <EmptyState
            title={query ? 'No matches found' : 'No products yet'}
            description={query ? 'Try a different keyword.' : 'Search will become useful once live listings are added.'}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
    margin: AppTheme.spacing.md,
    paddingHorizontal: AppTheme.spacing.md,
    height: 52,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: AppTheme.colors.surface
  },
  input: {
    flex: 1,
    color: AppTheme.colors.text
  },
  list: {
    paddingHorizontal: AppTheme.spacing.md,
    paddingBottom: AppTheme.spacing.xl,
    gap: AppTheme.spacing.md
  },
  item: {
    width: '100%'
  }
});
