import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/components/common/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import PolicySection from '@/components/common/PolicySection';
import { AppTheme } from '@/theme';
import { products } from '@/data/mock';
import { formatCurrency } from '@/utils/format';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart, selectUiState, toggleWishlist } from '@/store/slices/uiSlice';
import { showFeedback } from '@/store/slices/feedbackSlice';
import { ROUTES } from '@/constants/navigation';
import { selectAuthToken } from '@/store/slices/authSlice';
import { useToggleFavoriteMutation } from '@/store/api/favoriteApi';
import { useUpsertCartItemMutation } from '@/store/api/cartApi';
import { executeWithOfflineQueue } from '@/services/offlineQueue';
import { EmptyState } from '@/components/layout/EmptyState';

type Props = any;

const fallbackPolicies = [
  {
    title: '7-Day Return',
    description: 'Unused products can be returned within 7 days of delivery.',
    tone: 'success' as const,
    icon: 'refresh-outline' as const
  },
  {
    title: 'Replacement Support',
    description: 'Wrong size or damaged item? Request a fast replacement.',
    tone: 'primary' as const,
    icon: 'swap-horizontal-outline' as const
  },
  {
    title: 'Secure Payment Ready',
    description: 'Checkout is prepared for safe payment gateway integration.',
    tone: 'info' as const,
    icon: 'shield-checkmark-outline' as const
  }
];

export function ProductDetailsScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const ui = useAppSelector(selectUiState);
  const token = useAppSelector(selectAuthToken);
  const [toggleFavorite] = useToggleFavoriteMutation();
  const [upsertCartItem] = useUpsertCartItemMutation();
  const productId = route?.params?.productId;
  const { width } = useWindowDimensions();

  const item = useMemo(
    () => products.find((product) => product.id === productId) ?? null,
    [productId]
  );

  if (!item) {
    return (
      <Screen>
        <PageHeader title="Product Details" subtitle="No product is available right now." onBack={() => navigation.goBack()} />
        <View style={styles.emptyWrap}>
          <EmptyState
            title="No live product"
            description="When listings are published, product details will appear here."
            actionLabel="Go back"
            onActionPress={() => navigation.goBack()}
          />
        </View>
      </Screen>
    );
  }

  const colorOptions = useMemo(
    () => item.colors?.length ? item.colors : [{ name: 'Default', hex: '#D9C7BD', image: item.image }],
    [item]
  );
  const sizeOptions = item.sizes ?? [];
  const policies = item.policies?.length ? item.policies : fallbackPolicies;
  const relatedProducts = useMemo(() => {
    if (item.relatedIds?.length) {
      return products.filter((product) => item.relatedIds?.includes(product.id) && product.id !== item.id);
    }
    return products.filter((product) => product.category === item.category && product.id !== item.id).slice(0, 4);
  }, [item]);

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(item.sizes?.[0] ?? null);

  useEffect(() => {
    setSelectedColorIndex(0);
    setSelectedSize(item.sizes?.[0] ?? null);
  }, [item.id]);

  const selectedColor = colorOptions[selectedColorIndex] ?? colorOptions[0];
  const selectedImage = selectedColor.image ?? item.gallery?.[0] ?? item.image;
  const selectedPrice = item.price + (selectedColor.priceDelta ?? 0);
  const wishlisted = ui.wishlist.includes(item.id);
  const inCart = Boolean(ui.cart[item.id]);
  const stockLabel = typeof item.stock === 'number' ? `${item.stock} left` : 'In stock';

  const syncWishlist = async () => {
    const nextWishlisted = !wishlisted;
    dispatch(toggleWishlist(item.id));

    if (!token) {
      dispatch(showFeedback({
        type: 'info',
        title: nextWishlisted ? 'Saved locally' : 'Removed locally',
        message: 'Sign in to sync wishlist to your account.'
      }));
      return;
    }

    const result = await executeWithOfflineQueue({
      type: 'favorite.toggle',
      payload: { productId: item.id, favorited: nextWishlisted },
      action: () => toggleFavorite({ productId: item.id, favorited: nextWishlisted }).unwrap()
    });

    dispatch(showFeedback({
      type: result.queued ? 'info' : 'success',
      title: nextWishlisted ? 'Added to wishlist' : 'Removed from wishlist',
      message: result.queued ? 'Saved offline. It will sync automatically.' : item.title
    }));
  };

  const syncCart = async (goToCheckout = false) => {
    const nextQuantity = (ui.cart[item.id] ?? 0) + 1;
    dispatch(addToCart(item.id));

    const selectedColorName = selectedColor?.name;
    const selectedSizeValue = selectedSize ?? undefined;

    if (!token) {
      dispatch(showFeedback({
        type: 'info',
        title: 'Added locally',
        message: 'Sign in to sync cart items to your account.'
      }));
      if (goToCheckout) {
        navigation.navigate(ROUTES.Checkout);
      }
      return;
    }

    const result = await executeWithOfflineQueue({
      type: 'cart.upsert',
      payload: {
        productId: item.id,
        quantity: nextQuantity,
        selectedSize: selectedSizeValue,
        selectedColor: selectedColorName
      },
      action: () =>
        upsertCartItem({
          productId: item.id,
          quantity: nextQuantity,
          selectedSize: selectedSizeValue,
          selectedColor: selectedColorName
        }).unwrap()
    });

    dispatch(showFeedback({
      type: result.queued ? 'info' : 'success',
      title: 'Added to cart',
      message: result.queued ? 'Saved offline. It will sync automatically.' : item.title
    }));

    if (goToCheckout) {
      navigation.navigate(ROUTES.Checkout);
    }
  };

  const tabletShell = width >= 900;

  return (
    <Screen>
      <PageHeader
        title="Product Details"
        subtitle="Sizes, colors, policies, and related picks are all here."
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={[styles.content, tabletShell && styles.contentWide]} showsVerticalScrollIndicator={false}>
        <View style={styles.heroWrap}>
          <View style={styles.hero}>
            <Image source={{ uri: selectedImage }} style={styles.image} contentFit="cover" />
            <View style={styles.heroTopRow}>
              <View style={styles.heroChip}>
                <Ionicons name="pricetag-outline" size={12} color={AppTheme.colors.white} />
                <AppText variant="small" tone="white">{item.badge ?? 'Featured'}</AppText>
              </View>
              <View style={styles.heroChipSoft}>
                <Ionicons name="cube-outline" size={12} color={AppTheme.colors.primary} />
                <AppText variant="small" tone="primary">{stockLabel}</AppText>
              </View>
            </View>
            {item.discount ? (
              <View style={styles.discountChip}>
                <AppText variant="label" tone="white">{item.discount} OFF</AppText>
              </View>
            ) : null}
          </View>

          <View style={styles.galleryRow}>
            <FlatList
              horizontal
              data={colorOptions}
              keyExtractor={(color) => color.name}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.colorList}
              renderItem={({ item: color, index }) => {
                const active = index === selectedColorIndex;
                return (
                  <Pressable
                    onPress={() => setSelectedColorIndex(index)}
                    style={[
                      styles.colorPill,
                      active && styles.colorPillActive,
                      { borderColor: color.hex }
                    ]}
                  >
                    <View style={[styles.colorDot, { backgroundColor: color.hex }]} />
                    <AppText variant="small" tone={active ? 'primary' : 'soft'}>{color.name}</AppText>
                  </Pressable>
                );
              }}
            />
          </View>
        </View>

        <View style={styles.card}>
          <AppText variant="small" tone="soft">{item.category}</AppText>
          <AppText variant="headline">{item.title}</AppText>
          <AppText variant="body" tone="soft">{item.subtitle ?? item.vendor ?? 'Premium marketplace collection'}</AppText>

          <View style={styles.priceRow}>
            <AppText variant="headline" tone="primary">{formatCurrency(selectedPrice)}</AppText>
            {item.mrp ? <AppText variant="body" tone="soft" style={styles.strike}>{formatCurrency(item.mrp)}</AppText> : null}
            <View style={styles.rating}>
              <Ionicons name="star" color={AppTheme.colors.white} size={12} />
              <AppText variant="small" tone="white">{item.rating?.toFixed(1) ?? '4.8'}</AppText>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoChip}>
              <Ionicons name="time-outline" size={14} color={AppTheme.colors.primary} />
              <AppText variant="small" tone="soft">{item.deliveryText ?? 'Fast delivery available'}</AppText>
            </View>
            <View style={styles.infoChip}>
              <Ionicons name="shield-checkmark-outline" size={14} color={AppTheme.colors.primary} />
              <AppText variant="small" tone="soft">Secure checkout</AppText>
            </View>
          </View>

          {item.highlights?.length ? (
            <View style={styles.highlightRow}>
              {item.highlights.slice(0, 3).map((highlight) => (
                <View key={highlight} style={styles.highlightChip}>
                  <AppText variant="small" tone="soft">{highlight}</AppText>
                </View>
              ))}
            </View>
          ) : null}

          {sizeOptions.length ? (
            <View style={styles.block}>
              <View style={styles.blockTitle}>
                <AppText variant="title">Select Size</AppText>
                <AppText variant="small" tone="soft">Choose your preferred fit</AppText>
              </View>
              <View style={styles.sizeGrid}>
                {sizeOptions.map((size) => {
                  const active = selectedSize === size;
                  return (
                    <Pressable
                      key={size}
                      onPress={() => setSelectedSize(size)}
                      style={[styles.sizeChip, active && styles.sizeChipActive]}
                    >
                      <AppText variant="label" tone={active ? 'white' : 'soft'}>{size}</AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}

          <View style={styles.block}>
            <View style={styles.blockTitle}>
              <AppText variant="title">Select Color</AppText>
              <AppText variant="small" tone="soft">Swipe or tap to switch product image</AppText>
            </View>
            <View style={styles.swatchGrid}>
              {colorOptions.map((color, index) => {
                const active = index === selectedColorIndex;
                return (
                  <Pressable
                    key={color.name}
                    onPress={() => setSelectedColorIndex(index)}
                    style={[styles.swatchCard, active && styles.swatchCardActive]}
                  >
                    <View style={[styles.swatch, { backgroundColor: color.hex }]} />
                    <AppText variant="small" tone={active ? 'primary' : 'soft'} numberOfLines={1}>
                      {color.name}
                    </AppText>
                    {color.priceDelta ? (
                      <AppText variant="small" tone="soft">+{formatCurrency(color.priceDelta)}</AppText>
                    ) : (
                      <AppText variant="small" tone="soft">Base price</AppText>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.rowActions}>
            <AppButton
              title={wishlisted ? 'Saved' : 'Wishlist'}
              variant="secondary"
              style={styles.flex}
              onPress={() => void syncWishlist()}
            />
            <AppButton
              title={inCart ? 'In Cart' : 'Add to Cart'}
              style={styles.flex}
              onPress={() => void syncCart(false)}
            />
          </View>
          <AppButton title="Buy Now" variant="ghost" onPress={() => void syncCart(true)} />
        </View>

        <View style={styles.card}>
          <PolicySection />
        </View>

        <View style={styles.card}>
          <View style={styles.blockTitle}>
            <AppText variant="title">Related Picks</AppText>
            <AppText variant="small" tone="soft">More items from the same vibe</AppText>
          </View>
          <FlatList
            horizontal
            data={relatedProducts}
            keyExtractor={(product) => product.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedList}
            renderItem={({ item: product }) => (
              <Pressable style={styles.relatedCard} onPress={() => navigation.navigate(ROUTES.ProductDetails, { productId: product.id })}>
                <Image source={{ uri: product.image }} style={styles.relatedImage} contentFit="cover" />
                <View style={styles.relatedMeta}>
                  <AppText variant="small" tone="soft" numberOfLines={1}>{product.category}</AppText>
                  <AppText variant="label" numberOfLines={2}>{product.title}</AppText>
                  <AppText variant="label" tone="primary">{formatCurrency(product.price)}</AppText>
                </View>
              </Pressable>
            )}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: AppTheme.spacing.md,
    paddingBottom: AppTheme.spacing.xl,
    gap: AppTheme.spacing.md
  },
  contentWide: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 760
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center'
  },
  heroWrap: {
    gap: AppTheme.spacing.sm
  },
  hero: {
    height: 360,
    borderRadius: AppTheme.radius.lg,
    overflow: 'hidden',
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  image: {
    width: '100%',
    height: '100%'
  },
  heroTopRow: {
    position: 'absolute',
    top: AppTheme.spacing.md,
    left: AppTheme.spacing.md,
    right: AppTheme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: AppTheme.spacing.sm
  },
  heroChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(160,65,0,0.88)',
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 6,
    borderRadius: AppTheme.radius.pill
  },
  heroChipSoft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 6,
    borderRadius: AppTheme.radius.pill
  },
  discountChip: {
    position: 'absolute',
    bottom: AppTheme.spacing.md,
    left: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.primaryStrong,
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: 6,
    borderRadius: AppTheme.radius.pill
  },
  galleryRow: {
    paddingHorizontal: 2
  },
  colorList: {
    gap: AppTheme.spacing.sm
  },
  colorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 8,
    borderRadius: AppTheme.radius.pill,
    borderWidth: 1,
    backgroundColor: AppTheme.colors.surface,
    borderColor: AppTheme.colors.borderSoft
  },
  colorPillActive: {
    backgroundColor: AppTheme.colors.surfaceSoft,
    borderColor: AppTheme.colors.primary
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)'
  },
  card: {
    gap: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.lg,
    padding: AppTheme.spacing.md,
    ...AppTheme.shadow.card
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
    flexWrap: 'wrap'
  },
  strike: {
    textDecorationLine: 'line-through'
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: AppTheme.colors.primary
  },
  infoRow: {
    flexDirection: 'row',
    gap: AppTheme.spacing.sm,
    flexWrap: 'wrap'
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 8,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  highlightRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm
  },
  highlightChip: {
    borderRadius: AppTheme.radius.pill,
    backgroundColor: AppTheme.colors.surfaceSoft,
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 8
  },
  block: {
    gap: AppTheme.spacing.sm
  },
  blockTitle: {
    gap: 4
  },
  sizeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm
  },
  sizeChip: {
    minWidth: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 10,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: AppTheme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  sizeChipActive: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primary
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm
  },
  swatchCard: {
    flexBasis: '31%',
    minWidth: 96,
    gap: 6,
    padding: AppTheme.spacing.sm,
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  swatchCardActive: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: AppTheme.colors.surfaceWarm
  },
  swatch: {
    width: '100%',
    height: 48,
    borderRadius: AppTheme.radius.sm
  },
  rowActions: {
    flexDirection: 'row',
    gap: AppTheme.spacing.sm
  },
  flex: {
    flex: 1
  },
  policyList: {
    gap: AppTheme.spacing.sm
  },
  policyRow: {
    flexDirection: 'row',
    gap: AppTheme.spacing.sm,
    alignItems: 'flex-start',
    padding: AppTheme.spacing.sm,
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  policyIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.primary
  },
  policyIconSuccess: {
    backgroundColor: AppTheme.colors.success
  },
  policyIconInfo: {
    backgroundColor: AppTheme.colors.info
  },
  policyIconDanger: {
    backgroundColor: AppTheme.colors.danger
  },
  relatedList: {
    gap: AppTheme.spacing.md
  },
  relatedCard: {
    width: 148,
    borderRadius: AppTheme.radius.lg,
    overflow: 'hidden',
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  relatedImage: {
    width: '100%',
    height: 132
  },
  relatedMeta: {
    gap: 4,
    padding: AppTheme.spacing.sm
  }
});
