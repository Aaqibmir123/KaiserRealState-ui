import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useForm } from 'react-hook-form';

import { Screen } from '@/components/common/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionCard } from '@/components/layout/SectionCard';
import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/common/AppButton';
import { AppTheme } from '@/theme';
import { useAppDispatch } from '@/store/hooks';
import { showFeedback } from '@/store/slices/feedbackSlice';
import { pickAndUploadImage } from '@/services/imageUpload';
import { Testimonial } from '@/types/models';
import { TestimonialCard } from '@/components/common/TestimonialCard';
import {
  useCreateTestimonialMutation,
  useDeleteTestimonialMutation,
  useGetAdminTestimonialsQuery,
  useUpdateTestimonialMutation
} from '@/store/api/testimonialApi';
import { TestimonialEditorModal, TestimonialFormValues } from './TestimonialEditorModal';

const createDraft = (): TestimonialFormValues => ({
  clientName: '',
  feedback: '',
  rating: 5,
  photoUrl: '',
  location: '',
  purchaseDate: '',
  sortOrder: 0,
  isActive: true
});

export function AdminTestimonialsScreen() {
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();
  const stacked = width < 720;
  const { data, refetch, isFetching } = useGetAdminTestimonialsQuery(undefined, { refetchOnFocus: true });
  const [createTestimonial] = useCreateTestimonialMutation();
  const [updateTestimonial] = useUpdateTestimonialMutation();
  const [deleteTestimonial] = useDeleteTestimonialMutation();
  const [visible, setVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { control, handleSubmit, reset, watch, setValue } = useForm();

  const items = useMemo(() => (data?.data ?? data ?? []) as Testimonial[], [data]);

  useEffect(() => {
    if (!visible) return;
    if (editingId) return;
    reset(createDraft());
  }, [editingId, reset, visible]);

  const openCreate = () => {
    setEditingId(null);
    reset(createDraft());
    setVisible(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditingId(item.id);
    reset({
      clientName: item.clientName ?? '',
      feedback: item.feedback ?? '',
      rating: item.rating ?? 5,
      photoUrl: item.photoUrl ?? '',
      location: item.location ?? '',
      purchaseDate: item.purchaseDate ?? '',
      sortOrder: item.sortOrder ?? 0,
      isActive: item.isActive ?? true
    });
    setVisible(true);
  };

  const uploadPhoto = async () => {
    try {
      const url = await pickAndUploadImage();
      if (!url) return;
      setValue('photoUrl', url, { shouldDirty: true });
      dispatch(showFeedback({ type: 'success', title: 'Photo uploaded', message: 'Client photo attached.' }));
    } catch (error: any) {
      dispatch(showFeedback({ type: 'error', title: 'Upload failed', message: error?.message ?? 'Try again.' }));
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteTestimonial(id).unwrap();
      dispatch(showFeedback({ type: 'success', title: 'Deleted', message: 'Testimonial removed.' }));
    } catch (error: any) {
      dispatch(showFeedback({ type: 'error', title: 'Delete failed', message: error?.data?.message ?? 'Could not delete testimonial.' }));
    }
  };

  const save = handleSubmit(async (values: TestimonialFormValues) => {
    const payload = {
      clientName: values.clientName.trim(),
      feedback: values.feedback.trim(),
      rating: Number(values.rating || 0),
      photoUrl: values.photoUrl.trim() || undefined,
      location: values.location.trim() || undefined,
      purchaseDate: values.purchaseDate.trim() || undefined,
      sortOrder: Number(values.sortOrder || 0),
      isActive: Boolean(values.isActive)
    };

    try {
      if (editingId) {
        await updateTestimonial({ id: editingId, ...payload }).unwrap();
        dispatch(showFeedback({ type: 'success', title: 'Updated', message: 'Testimonial saved.' }));
      } else {
        await createTestimonial(payload).unwrap();
        dispatch(showFeedback({ type: 'success', title: 'Created', message: 'Testimonial added.' }));
      }
      setVisible(false);
      setEditingId(null);
      reset(createDraft());
    } catch (error: any) {
      dispatch(showFeedback({ type: 'error', title: 'Save failed', message: error?.data?.message ?? 'Please review the form.' }));
    }
  });

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader title="Testimonials" subtitle="Add client feedback, ratings, and photos. Home page reads from this list." />

        <LinearGradient colors={['#0B5A43', '#0D6A4D']} style={styles.hero}>
          <View style={styles.heroRow}>
            <View style={styles.heroStat}>
              <AppText variant="small" tone="white">Testimonials</AppText>
              <AppText variant="headline" tone="white">{items.length}</AppText>
            </View>
            <View style={styles.heroStat}>
              <AppText variant="small" tone="white">Visible</AppText>
              <AppText variant="headline" tone="white">{items.filter((item) => item.isActive).length}</AppText>
            </View>
          </View>
          <AppButton title={isFetching ? 'Refreshing...' : 'Refresh'} variant="secondary" onPress={refetch} />
        </LinearGradient>

        <SectionCard style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AppText variant="title">Client feedback</AppText>
            <AppButton title="Add testimonial" onPress={openCreate} />
          </View>

          {items.length ? (
            <View style={styles.grid}>
              {items.map((item) => (
                <View key={item.id} style={styles.gridItem}>
                  <TestimonialCard item={item} stacked={stacked} onEdit={() => openEdit(item)} onDelete={() => void remove(item.id)} />
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-ellipses-outline" size={28} color={AppTheme.colors.primary} />
              <AppText variant="headline" style={{ marginTop: 12 }}>No testimonials yet</AppText>
              <AppText variant="body" tone="soft" style={styles.centerText}>Add client feedback and it will show on the home page automatically.</AppText>
            </View>
          )}
        </SectionCard>
      </ScrollView>

      <TestimonialEditorModal
        visible={visible}
        control={control}
        watch={watch}
        setValue={setValue}
        onClose={() => setVisible(false)}
        onSave={() => void save()}
        onUpload={() => void uploadPhoto()}
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
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.lg,
    gap: AppTheme.spacing.md
  },
  heroRow: {
    flexDirection: 'row',
    gap: AppTheme.spacing.sm
  },
  heroStat: {
    flex: 1,
    padding: AppTheme.spacing.sm,
    borderRadius: AppTheme.radius.md,
    backgroundColor: 'rgba(255,255,255,0.12)'
  },
  sectionCard: {
    gap: AppTheme.spacing.md
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: AppTheme.spacing.sm
  },
  grid: {
    gap: AppTheme.spacing.md
  },
  gridItem: {
    width: '100%'
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: AppTheme.spacing.xl
  },
  centerText: {
    textAlign: 'center',
    marginTop: 8
  }
});
