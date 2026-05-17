import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, FlatList, Pressable } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { Screen } from '@/components/common/Screen';
import { AppText } from '@/components/common/AppText';
import { AppTheme } from '@/theme';
import { categories, products, reels } from '@/data/mock';
import { CategoryPill } from '@/components/product/CategoryPill';
import { ProductCard } from '@/components/product/ProductCard';
import { SectionHeader } from '@/components/common/SectionHeader';
import { EmptyState } from '@/components/layout/EmptyState';
import { TestimonialCard } from '@/components/common/TestimonialCard';
import { ROUTES } from '@/constants/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addToCart, selectUiState, toggleWishlist } from '@/store/slices/uiSlice';
import { showFeedback } from '@/store/slices/feedbackSlice';
import { selectAuthToken } from '@/store/slices/authSlice';
import { useToggleFavoriteMutation } from '@/store/api/favoriteApi';
import { useUpsertCartItemMutation } from '@/store/api/cartApi';
import { executeWithOfflineQueue } from '@/services/offlineQueue';
import { useGetTestimonialsQuery } from '@/store/api/testimonialApi';
import { Testimonial } from '@/types/models';

type Props = any;

export function HomeScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const ui = useAppSelector(selectUiState);
  const token = useAppSelector(selectAuthToken);
  const topCategories = useMemo(() => categories.slice(0, 5), []);
  const { data: testimonialsData } = useGetTestimonialsQuery(undefined, { refetchOnFocus: true });
  const hasProducts = products.length > 0;
  const hasCategories = categories.length > 0;
  const hasReels = reels.length > 0;
  const testimonials = (testimonialsData?.data ?? testimonialsData ?? []) as Testimonial[];
  const cartCount = Object.values(ui.cart).reduce((sum, quantity) => sum + quantity, 0);
  const [toggleFavorite] = useToggleFavoriteMutation();
  const [upsertCartItem] = useUpsertCartItemMutation();

  const isWishlisted = (productId: string) => ui.wishlist.includes(productId);
  const isInCart = (productId: string) => Boolean(ui.cart[productId]);

  const syncWishlist = async (productId: string, nextWishlisted: boolean, title: string) => {
    dispatch(toggleWishlist(productId));

    if (!token) {
      dispatch(showFeedback({
        type: 'info',
        title: nextWishlisted ? 'Added locally' : 'Removed locally',
        message: 'Sign in to sync wishlist to your account.'
      }));
      return;
    }

    const result = await executeWithOfflineQueue({
      type: 'favorite.toggle',
      payload: { productId, favorited: nextWishlisted },
      action: () => toggleFavorite({ productId, favorited: nextWishlisted }).unwrap()
    });

    dispatch(showFeedback({
      type: result.queued ? 'info' : 'success',
      title: nextWishlisted ? 'Added to wishlist' : 'Removed from wishlist',
      message: result.queued ? 'Saved offline. It will sync automatically.' : title
    }));
  };

  const syncCart = async (productId: string, nextQuantity: number, title: string) => {
    dispatch(addToCart(productId));

    if (!token) {
      dispatch(showFeedback({
        type: 'info',
        title: 'Added locally',
        message: 'Sign in to sync cart items to your account.'
      }));
      return;
    }

    const result = await executeWithOfflineQueue({
      type: 'cart.upsert',
      payload: { productId, quantity: nextQuantity },
      action: () => upsertCartItem({ productId, quantity: nextQuantity }).unwrap()
    });

    dispatch(showFeedback({
      type: result.queued ? 'info' : 'success',
      title: 'Added to cart',
      message: result.queued ? 'Saved offline. It will sync automatically.' : title
    }));
  };

  return (
    <Screen edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <AppText variant="small" tone="soft">Good morning</AppText>
            <AppText variant="headline">Shopora</AppText>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconButton} onPress={() => navigation.navigate(ROUTES.Notifications)}>
              <Ionicons name="notifications-outline" size={20} color={AppTheme.colors.primary} />
            </Pressable>
            <Pressable style={styles.iconButton} onPress={() => navigation.navigate(ROUTES.Wishlist)}>
              <Ionicons name="heart-outline" size={20} color={AppTheme.colors.primary} />
              {ui.wishlist.length ? <View style={styles.badge}><AppText variant="small" tone="white">{ui.wishlist.length}</AppText></View> : null}
            </Pressable>
            <Pressable style={styles.iconButton} onPress={() => navigation.navigate(ROUTES.MainTabs + ':Cart')}>
              <Ionicons name="bag-outline" size={20} color={AppTheme.colors.primary} />
              {cartCount ? <View style={styles.badge}><AppText variant="small" tone="white">{cartCount}</AppText></View> : null}
            </Pressable>
          </View>
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={AppTheme.colors.textSoft} />
          <AppText variant="body" tone="soft" style={{ flex: 1 }} onPress={() => navigation.navigate(ROUTES.Search)}>
            Search for fashion, beauty, tech...
          </AppText>
          <MaterialCommunityIcons name="microphone-outline" size={20} color={AppTheme.colors.primary} />
        </View>

        {hasProducts ? (
          <View style={styles.banner}>
            <Image source={{ uri: products[0].image }} style={styles.bannerImage} contentFit="cover" />
            <View style={styles.bannerOverlay}>
              <AppText variant="small" tone="white">Featured listing</AppText>
              <AppText variant="headline" tone="white">{products[0].title}</AppText>
              <AppText variant="body" tone="white">{products[0].subtitle ?? 'Clear details, direct purchasing, and fast support.'}</AppText>
            </View>
          </View>
        ) : (
          <View style={styles.emptyBanner}>
            <AppText variant="small" tone="soft">Featured listing</AppText>
            <AppText variant="headline">Catalog setup is in progress</AppText>
            <AppText variant="body" tone="soft">Add live products from the seller panel and they will appear here.</AppText>
          </View>
        )}

        <SectionHeader title="Categories" actionLabel="View All" onActionPress={() => navigation.navigate(ROUTES.MainTabs + ':Categories')} />
        {hasCategories ? (
          <FlatList
            horizontal
            data={topCategories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CategoryPill category={item} />}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        ) : (
          <EmptyState
            title="No categories yet"
            description="Create the first category in the admin panel to start organizing products."
          />
        )}

        {hasProducts ? (
          <View style={styles.flashCard}>
          <SectionHeader title="Flash Sale" subtitle="Ends in 02 : 45 : 12" />
          <FlatList
            horizontal
            data={products.slice(0, 2)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ width: 180, marginRight: AppTheme.spacing.md }}>
                  <ProductCard
                    item={item}
                    compact
                    onPress={() => navigation.navigate(ROUTES.ProductDetails, { productId: item.id })}
                    onToggleFavorite={() => {
                      const nextWishlisted = !ui.wishlist.includes(item.id);
                      void syncWishlist(item.id, nextWishlisted, item.title);
                    }}
                    onAddToCart={() => {
                      const nextQuantity = (ui.cart[item.id] ?? 0) + 1;
                      void syncCart(item.id, nextQuantity, item.title);
                    }}
                    isWishlisted={isWishlisted(item.id)}
                    isInCart={isInCart(item.id)}
                  />
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />
          </View>
        ) : (
          <EmptyState
            title="No live listings"
            description="Once the catalog is added, featured items will appear here."
          />
        )}

        {hasReels ? (
          <>
            <SectionHeader title="Reels Shopping" actionLabel="View All" />
            <FlatList
              horizontal
              data={reels}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.reelCard}>
                  <Image source={{ uri: item.image }} style={styles.reelImage} contentFit="cover" />
                  <View style={styles.reelOverlay}>
                    <AppText variant="label" tone="white">{item.title}</AppText>
                    <AppText variant="small" tone="white">{item.handle}</AppText>
                  </View>
                </View>
              )}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </>
        ) : (
          <EmptyState
            title="No reels yet"
            description="Short product stories and highlights will show up here later."
          />
        )}

        {hasProducts ? (
          <>
            <SectionHeader title="Trending Now" />
            <View style={styles.grid}>
              {products.map((item) => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onPress={() => navigation.navigate(ROUTES.ProductDetails, { productId: item.id })}
                  onToggleFavorite={() => {
                    const nextWishlisted = !ui.wishlist.includes(item.id);
                    void syncWishlist(item.id, nextWishlisted, item.title);
                  }}
                  onAddToCart={() => {
                    const nextQuantity = (ui.cart[item.id] ?? 0) + 1;
                    void syncCart(item.id, nextQuantity, item.title);
                  }}
                  isWishlisted={isWishlisted(item.id)}
                  isInCart={isInCart(item.id)}
                />
              ))}
            </View>
          </>
        ) : null}

        <SectionHeader title="Client testimonials" subtitle="What buyers say about the service" />
        {testimonials.length ? (
          <FlatList
            horizontal
            data={testimonials.slice(0, 4)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.testimonialWrap}>
                <TestimonialCard item={item} readOnly />
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        ) : (
          <EmptyState
            title="No testimonials yet"
            description="Add feedback from the admin testimonial panel and it will appear here automatically."
          />
        )}

        <View style={styles.footerCard}>
          <AppText variant="headline" tone="primary">Shopora</AppText>
          <AppText variant="body" tone="soft" style={{ marginTop: AppTheme.spacing.sm }}>
            The world&apos;s premium marketplace for fashion, beauty, tech, and more.
          </AppText>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: AppTheme.spacing.md,
    paddingBottom: AppTheme.spacing.xl,
    gap: AppTheme.spacing.lg
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerActions: {
    flexDirection: 'row',
    gap: AppTheme.spacing.sm
  },
  iconButton: {
    position: 'relative',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: AppTheme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...AppTheme.shadow.card
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.primaryStrong
  },
  searchBar: {
    minHeight: 52,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: AppTheme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
    paddingHorizontal: AppTheme.spacing.md,
    ...AppTheme.shadow.card
  },
  banner: {
    height: 200,
    borderRadius: AppTheme.radius.lg,
    overflow: 'hidden'
  },
  emptyBanner: {
    minHeight: 200,
    borderRadius: AppTheme.radius.lg,
    padding: AppTheme.spacing.lg,
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.surface,
    ...AppTheme.shadow.card
  },
  bannerImage: {
    width: '100%',
    height: '100%'
  },
  bannerOverlay: {
    position: 'absolute',
    inset: 0,
    padding: AppTheme.spacing.lg,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.28)'
  },
  horizontalList: {
    paddingVertical: 4,
    gap: AppTheme.spacing.md
  },
  testimonialWrap: {
    width: 280,
    marginRight: AppTheme.spacing.md
  },
  flashCard: {
    gap: AppTheme.spacing.md,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.surface,
    ...AppTheme.shadow.card
  },
  reelCard: {
    width: 140,
    height: 220,
    borderRadius: AppTheme.radius.lg,
    overflow: 'hidden',
    marginRight: AppTheme.spacing.md
  },
  reelImage: {
    width: '100%',
    height: '100%'
  },
  reelOverlay: {
    position: 'absolute',
    inset: 0,
    justifyContent: 'flex-end',
    padding: AppTheme.spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.25)'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.md,
    justifyContent: 'space-between'
  },
  footerCard: {
    padding: AppTheme.spacing.lg,
    borderRadius: AppTheme.radius.lg,
    backgroundColor: AppTheme.colors.primaryContainer
  }
});
