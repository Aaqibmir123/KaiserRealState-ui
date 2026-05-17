import React, { useEffect } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { AppText } from '@/components/common/AppText';
import { SectionCard } from '@/components/layout/SectionCard';
import { AppTheme } from '@/theme';
const stars = [1, 2, 3, 4, 5];

export function TestimonialEditorModal({
  visible,
  control,
  watch,
  setValue,
  onClose,
  onSave,
  onUpload
}: {
  visible: boolean;
  control: any;
  watch: (name: keyof TestimonialFormValues) => any;
  setValue: (name: keyof TestimonialFormValues, value: any, options?: any) => void;
  onClose: () => void;
  onSave: () => void;
  onUpload: () => void;
}) {
  const rating = Number(watch('rating') || 0);

  useEffect(() => {
    if (!visible) return;
    if (!watch('rating')) {
      setValue('rating', 5, { shouldDirty: false });
    }
  }, [visible, setValue, watch]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <AppText variant="headline">Add testimonial</AppText>
              <AppText variant="small" tone="soft">Client name, rating, feedback, and photo.</AppText>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={22} color={AppTheme.colors.primary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.row}>
              <AppInput control={control} name="clientName" label="Client name" placeholder="Client name" containerStyle={styles.flexField} />
              <AppInput control={control} name="location" label="Location" placeholder="Kupwara, Jammu and Kashmir" containerStyle={styles.flexField} />
            </View>

            <AppInput
              control={control}
              name="feedback"
              label="Feedback"
              placeholder="Write the client feedback..."
              multiline
              numberOfLines={5}
              style={styles.textArea}
            />

            <View style={styles.ratingCard}>
              <AppText variant="label">Rating</AppText>
              <View style={styles.ratingRow}>
                {stars.map((star) => (
                  <Pressable key={star} onPress={() => setValue('rating', star, { shouldDirty: true })} style={styles.starButton}>
                    <Ionicons name={star <= rating ? 'star' : 'star-outline'} size={20} color={star <= rating ? '#F4B400' : AppTheme.colors.textSoft} />
                  </Pressable>
                ))}
              </View>
              <AppText variant="small" tone="soft">{rating || 0}/5 selected</AppText>
            </View>

            <View style={styles.row}>
              <AppInput control={control} name="purchaseDate" label="Purchase date" placeholder="YYYY-MM-DD" containerStyle={styles.flexField} />
              <View style={styles.flexField}>
                <AppText variant="label">Photo</AppText>
                <AppButton title="Upload photo" variant="secondary" onPress={onUpload} />
                <AppText variant="small" tone="soft" style={styles.helper}>
                  {watch('photoUrl') ? 'Client photo uploaded' : 'Upload a client photo if available.'}
                </AppText>
              </View>
            </View>

            <View style={styles.toggleRow}>
              <AppText variant="label">Visible on home page</AppText>
              <Pressable
                onPress={() => setValue('isActive', !watch('isActive'), { shouldDirty: true })}
                style={[styles.toggleChip, watch('isActive') && styles.toggleChipActive]}
              >
                <AppText variant="small" tone={watch('isActive') ? 'white' : 'soft'}>
                  {watch('isActive') ? 'Active' : 'Hidden'}
                </AppText>
              </Pressable>
            </View>

            <SectionCard style={styles.previewCard}>
              <AppText variant="small" tone="soft">Preview</AppText>
              <AppText variant="title">{watch('clientName') || 'Client name'}</AppText>
              <AppText variant="body" tone="soft" numberOfLines={4}>
                {watch('feedback') || 'Client feedback will appear here.'}
              </AppText>
            </SectionCard>
          </ScrollView>

          <View style={styles.footer}>
            <AppButton title="Save testimonial" onPress={onSave} />
            <AppButton title="Cancel" variant="secondary" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export type TestimonialFormValues = {
  clientName: string;
  feedback: string;
  rating: number;
  photoUrl: string;
  location: string;
  purchaseDate: string;
  sortOrder: number;
  isActive: boolean;
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(10, 39, 30, 0.42)',
    justifyContent: 'center',
    padding: AppTheme.spacing.md
  },
  card: {
    maxHeight: '92%',
    borderRadius: AppTheme.radius.xl,
    backgroundColor: AppTheme.colors.surface,
    overflow: 'hidden'
  },
  header: {
    flexDirection: 'row',
    gap: AppTheme.spacing.md,
    alignItems: 'flex-start',
    padding: AppTheme.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppTheme.colors.border
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: AppTheme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  body: {
    padding: AppTheme.spacing.md,
    gap: AppTheme.spacing.md
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm
  },
  flexField: {
    flex: 1,
    minWidth: 150
  },
  textArea: {
    minHeight: 130,
    textAlignVertical: 'top',
    paddingTop: AppTheme.spacing.md
  },
  ratingCard: {
    gap: AppTheme.spacing.sm,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  ratingRow: {
    flexDirection: 'row',
    gap: 8
  },
  starButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.surface
  },
  helper: {
    marginTop: AppTheme.spacing.xs
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: AppTheme.spacing.md
  },
  toggleChip: {
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.sm,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  toggleChipActive: {
    backgroundColor: AppTheme.colors.primary
  },
  previewCard: {
    gap: AppTheme.spacing.sm
  },
  footer: {
    flexDirection: 'row',
    gap: AppTheme.spacing.sm,
    padding: AppTheme.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: AppTheme.colors.border
  }
});
