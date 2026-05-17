import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Ionicons } from '@expo/vector-icons';

import { Screen } from '@/components/common/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionCard } from '@/components/layout/SectionCard';
import { AppText } from '@/components/common/AppText';
import { AppInput } from '@/components/common/AppInput';
import { AppButton } from '@/components/common/AppButton';
import { AppTheme } from '@/theme';
import { useAppDispatch } from '@/store/hooks';
import { showFeedback } from '@/store/slices/feedbackSlice';
import { useGetCategoriesQuery } from '@/store/api/categoryApi';
import { useGetSellerProductsQuery, useCreateSellerProductMutation, useUpdateSellerProductMutation } from '@/store/api/sellerApi';
import { executeWithOfflineQueue } from '@/services/offlineQueue';
import { pickAndUploadImage } from '@/services/imageUpload';

const schema = z.object({
  title: z.string().min(3, 'Enter product title'),
  subtitle: z.string().optional(),
  price: z.string().min(1, 'Enter selling price'),
  mrp: z.string().optional(),
  stock: z.string().min(1, 'Enter stock quantity'),
  description: z.string().min(10, 'Add a better product description'),
  imageUrl: z.string().url('Enter a valid image URL'),
  status: z.enum(['LIVE', 'DRAFT'])
});

type FormValues = z.infer<typeof schema>;

const fallbackCategories = [
  { slug: 'fashion', name: 'Fashion' },
  { slug: 'tech', name: 'Tech' },
  { slug: 'beauty', name: 'Beauty' },
  { slug: 'home', name: 'Home' }
];

const statusMeta = {
  LIVE: {
    label: 'Publish now',
    helper: 'Product will be visible to shoppers immediately.',
    icon: 'rocket-outline'
  },
  DRAFT: {
    label: 'Save as draft',
    helper: 'Keep it hidden until you are ready to publish.',
    icon: 'bookmark-outline'
  }
} as const;

function toFormValues(product?: any): FormValues {
  return {
    title: product?.title ?? '',
    subtitle: product?.subtitle ?? '',
    price: product ? String(product.price) : '',
    mrp: product?.mrp ? String(product.mrp) : '',
    stock: product ? String(product.stock) : '0',
    description: product?.description ?? '',
    imageUrl: product?.imageUrl ?? '',
    status: product?.status === 'DRAFT' ? 'DRAFT' : 'LIVE'
  };
}

export function AddProductScreen({ navigation, route }: any) {
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();
  const productId = route?.params?.productId as string | undefined;
  const { data: sellerProductsData } = useGetSellerProductsQuery(undefined, { refetchOnFocus: true });
  const { data: categoriesData } = useGetCategoriesQuery(undefined, { refetchOnFocus: true });
  const [createSellerProduct, { isLoading: creating }] = useCreateSellerProductMutation();
  const [updateSellerProduct, { isLoading: updating }] = useUpdateSellerProductMutation();
  const [saving, setSaving] = useState(false);
  const { control, handleSubmit, reset, watch, setValue } = useForm<FormValues>();

  const products = sellerProductsData?.data ?? sellerProductsData ?? [];
  const existingProduct = products.find((item: any) => item.id === productId) ?? null;
  const categories = useMemo(
    () => (categoriesData?.data ?? categoriesData ?? fallbackCategories).slice(0, 8),
    [categoriesData]
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(existingProduct?.category?.slug ?? categories[0]?.slug ?? 'fashion');

  const isEditing = Boolean(existingProduct);
  const stackFields = width < 420;

  useEffect(() => {
    const nextValues = toFormValues(existingProduct);
    reset(nextValues);
    setSelectedCategory(existingProduct?.category?.slug ?? categories[0]?.slug ?? 'fashion');
  }, [categories, existingProduct, reset]);

  const onSubmit = handleSubmit((values: FormValues) => {
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      dispatch(showFeedback({ type: 'error', title: 'Validation failed', message: parsed.error.issues[0]?.message ?? 'Please review the form' }));
      return;
    }

    const payload = {
      title: parsed.data.title.trim(),
      subtitle: parsed.data.subtitle?.trim() || undefined,
      price: Number(parsed.data.price),
      mrp: parsed.data.mrp ? Number(parsed.data.mrp) : undefined,
      stock: Number(parsed.data.stock),
      description: parsed.data.description.trim(),
      imageUrl: parsed.data.imageUrl.trim(),
      status: parsed.data.status === 'DRAFT' ? 'DRAFT' : 'ACTIVE',
      categorySlug: selectedCategory
    };

    setSaving(true);
    const request = existingProduct
      ? executeWithOfflineQueue({
          type: 'seller.updateProduct',
          payload: { id: existingProduct.id, body: payload },
          action: () => updateSellerProduct({ id: existingProduct.id, ...payload }).unwrap()
        })
      : executeWithOfflineQueue({
          type: 'seller.createProduct',
          payload,
          action: () => createSellerProduct(payload).unwrap()
        });

    request
      .then(() => {
        dispatch(showFeedback({
          type: 'success',
          title: isEditing ? 'Product updated' : 'Product published',
          message: isEditing ? 'Your changes are saved in the seller catalog.' : 'The listing is now ready for shoppers.'
        }));
        navigation.goBack?.();
      })
      .catch((error: any) => {
        dispatch(showFeedback({
          type: 'error',
          title: 'Could not save product',
          message: error?.data?.message ?? 'Please try again.'
        }));
      })
      .finally(() => setSaving(false));
  });

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader title={isEditing ? 'Edit Product' : 'Add Product'} subtitle="Create a clean product listing." />

        <SectionCard>
          <AppText variant="title">Listing details</AppText>
          <View style={styles.form}>
            <AppInput control={control} name="title" label="Product title" placeholder="Enter product title" />
            <AppInput
              control={control}
              name="subtitle"
              label="Variant summary"
              placeholder="Sizes: M, L, XL | Colors: Black, Blue"
              helperText="Optional. Use this for size and color details shoppers should see."
            />
            <View style={styles.segmentWrap}>
              <AppText variant="label">Category</AppText>
              <View style={styles.chipRow}>
                {categories.map((item: any) => {
                  const active = selectedCategory === item.slug;
                  return (
                    <Pressable key={item.slug} onPress={() => setSelectedCategory(item.slug)} style={[styles.chip, active && styles.chipActive]}>
                      <AppText variant="small" tone={active ? 'white' : 'soft'}>{item.name}</AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
            <View style={stackFields ? styles.stack : styles.row}>
              <View style={styles.flexField}>
                <AppInput control={control} name="price" label="Selling price" placeholder="999" keyboardType="number-pad" />
              </View>
              <View style={styles.flexField}>
                <AppInput control={control} name="mrp" label="MRP" placeholder="1299" keyboardType="number-pad" />
              </View>
            </View>
            <View style={stackFields ? styles.stack : styles.row}>
              <View style={styles.flexField}>
                <AppInput control={control} name="stock" label="Stock" placeholder="25" keyboardType="number-pad" />
              </View>
              <View style={styles.statusCard}>
                <AppText variant="label" tone="soft">Visibility</AppText>
                <View style={styles.statusRow}>
                  {(['LIVE', 'DRAFT'] as const).map((status) => {
                    const active = watch('status') === status;
                    const meta = statusMeta[status];
                    return (
                      <Pressable
                        key={status}
                        onPress={() => {
                          const currentValues = watch() ?? {};
                          reset({ ...currentValues, status });
                        }}
                        style={[styles.statusChip, active && styles.statusChipActive]}
                      >
                        <Ionicons name={meta.icon as never} size={16} color={active ? AppTheme.colors.white : AppTheme.colors.primary} />
                        <View style={{ flex: 1 }}>
                          <AppText variant="small" tone={active ? 'white' : 'primary'}>{meta.label}</AppText>
                          <AppText variant="small" tone={active ? 'white' : 'soft'}>{meta.helper}</AppText>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            </View>
            <AppInput
              control={control}
              name="description"
              label="Description"
              placeholder="Tell shoppers why this product stands out"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={styles.multiline}
            />
            <AppButton
              title="Upload Product Image"
              variant="secondary"
              onPress={() =>
                void pickAndUploadImage()
                  .then((url) => {
                    if (!url) return;
                    setValue('imageUrl', url, { shouldDirty: true, shouldValidate: true });
                    dispatch(showFeedback({ type: 'success', title: 'Image uploaded', message: 'The uploaded image is ready to use.' }));
                  })
                  .catch((error: any) => {
                    dispatch(showFeedback({ type: 'error', title: 'Upload failed', message: error?.message ?? 'Please try again.' }));
                  })
              }
            />
            <View style={styles.uploadHint}>
              <Ionicons name="cloud-upload-outline" size={18} color={AppTheme.colors.primary} />
              <AppText variant="small" tone="soft">Upload from your phone. No catalog, search, or filters on this page.</AppText>
            </View>
          </View>
        </SectionCard>

        <View style={styles.actions}>
          <AppButton title={isEditing ? 'Save Changes' : 'Publish Product'} onPress={onSubmit} loading={saving || creating || updating} />
          <AppButton title="Cancel" variant="secondary" onPress={() => navigation.goBack?.()} />
        </View>
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
  form: {
    gap: AppTheme.spacing.md,
    marginTop: AppTheme.spacing.md
  },
  stack: {
    gap: AppTheme.spacing.sm
  },
  row: {
    flexDirection: 'row',
    gap: AppTheme.spacing.sm
  },
  flexField: {
    flex: 1
  },
  segmentWrap: {
    gap: AppTheme.spacing.sm
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm
  },
  chip: {
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  chipActive: {
    backgroundColor: AppTheme.colors.primary
  },
  statusCard: {
    flex: 1,
    gap: AppTheme.spacing.sm
  },
  statusRow: {
    gap: AppTheme.spacing.sm
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
    padding: AppTheme.spacing.sm,
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: 'transparent'
  },
  statusChipActive: {
    backgroundColor: AppTheme.colors.primary,
    borderColor: AppTheme.colors.primary
  },
  multiline: {
    minHeight: 124,
    paddingTop: AppTheme.spacing.md
  },
  uploadHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  actions: {
    gap: AppTheme.spacing.md
  }
});
