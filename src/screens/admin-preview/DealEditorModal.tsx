import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { AppText } from '@/components/common/AppText';
import { SectionCard } from '@/components/layout/SectionCard';
import { AppTheme } from '@/theme';
import { BuyDeal, DealMode, FormValues } from './landDealTypes';
import { LandDealMediaGrid } from './LandDealMediaGrid';

const formatProfit = (value: number) => (value >= 0 ? `+${value.toLocaleString()}` : `-${Math.abs(value).toLocaleString()}`);

export function DealEditorModal({
  visible,
  mode,
  control,
  watch,
  setValue,
  buyDeals,
  selectedSource,
  onClose,
  onSave,
  onUpload
}: {
  visible: boolean;
  mode: DealMode;
  control: any;
  watch: (name: keyof FormValues) => any;
  setValue: (name: keyof FormValues, value: any, options?: any) => void;
  buyDeals: BuyDeal[];
  selectedSource: BuyDeal | null;
  onClose: () => void;
  onSave: () => void;
  onUpload: (field: 'landImage' | 'aadhaarCardImage' | 'geoTagImage' | 'soldToAadhaarImage') => void;
}) {
  const [sourceOpen, setSourceOpen] = useState(false);

  useEffect(() => {
    if (mode !== 'sell' || !selectedSource) return;
    setValue('title', selectedSource.title, { shouldDirty: false });
    setValue('location', selectedSource.location, { shouldDirty: false });
    setValue('areaSize', selectedSource.areaSize, { shouldDirty: false });
    setValue('purchasePrice', selectedSource.purchasePrice, { shouldDirty: false });
    setValue('purchasedFromName', selectedSource.purchasedFromName, { shouldDirty: false });
    setValue('purchasedFromPhone', selectedSource.purchasedFromPhone, { shouldDirty: false });
    setValue('purchaseDate', selectedSource.purchaseDate, { shouldDirty: false });
    setValue('landImage', selectedSource.landImage, { shouldDirty: false });
    setValue('aadhaarCardImage', selectedSource.aadhaarCardImage, { shouldDirty: false });
    setValue('geoTagImage', selectedSource.geoTagImage, { shouldDirty: false });
  }, [mode, selectedSource, setValue]);

  useEffect(() => {
    setSourceOpen(false);
  }, [mode, visible]);

  const selectedSourceLabel = useMemo(() => {
    if (!selectedSource) return 'Select purchased property';
    return `${selectedSource.title} - ${selectedSource.location}`;
  }, [selectedSource]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <AppText variant="headline">{mode === 'buy' ? 'Add buy land' : 'Add sell land'}</AppText>
              <AppText variant="small" tone="soft">
                {mode === 'buy'
                  ? 'Save the purchase and proof images.'
                  : 'Choose a bought land, then save the sale and profit.'}
              </AppText>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={22} color={AppTheme.colors.primary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
            {mode === 'buy' ? (
              <>
                <View style={styles.row}>
                  <AppInput control={control} name="title" label="Property name" placeholder="Batergam land parcel" containerStyle={styles.flexField} />
                  <AppInput control={control} name="location" label="Location" placeholder="Kupwara, Jammu and Kashmir" containerStyle={styles.flexField} />
                </View>
                <View style={styles.row}>
                  <AppInput control={control} name="areaSize" label="Area size" placeholder="2 kanals" containerStyle={styles.flexField} />
                  <AppInput control={control} name="purchasePrice" label="Purchase price" placeholder="800000" keyboardType="numeric" containerStyle={styles.flexField} />
                </View>
                <View style={styles.row}>
                  <AppInput control={control} name="purchasedFromName" label="Purchased from" placeholder="Seller name" containerStyle={styles.flexField} />
                  <AppInput control={control} name="purchasedFromPhone" label="Phone number" placeholder="7889893844" keyboardType="phone-pad" containerStyle={styles.flexField} />
                </View>
                <AppInput control={control} name="purchaseDate" label="Purchase date" placeholder="YYYY-MM-DD" />
                <View style={styles.imageGrid}>
                  <AppButton title="Upload land photo" variant="secondary" onPress={() => onUpload('landImage')} style={styles.uploadButton} />
                  <AppButton title="Upload Aadhaar" variant="secondary" onPress={() => onUpload('aadhaarCardImage')} style={styles.uploadButton} />
                  <AppButton title="Upload geo tag" variant="secondary" onPress={() => onUpload('geoTagImage')} style={styles.uploadButton} />
                </View>
                <LandDealMediaGrid
                  compact
                  items={[
                    { label: 'Land photo', uri: watch('landImage') },
                    { label: 'Aadhaar card', uri: watch('aadhaarCardImage') },
                    { label: 'Geo tag', uri: watch('geoTagImage') }
                  ]}
                />
              </>
            ) : (
              <>
                <AppText variant="label">Select purchased property</AppText>
                <Pressable style={styles.dropdown} onPress={() => setSourceOpen((current) => !current)}>
                  <AppText variant="body" numberOfLines={1}>
                    {selectedSourceLabel}
                  </AppText>
                  <View style={styles.dropdownIcon}>
                    <Ionicons name={sourceOpen ? 'chevron-up' : 'chevron-down'} size={18} color={AppTheme.colors.primary} />
                  </View>
                </Pressable>

                {sourceOpen ? (
                  <View style={styles.sourceList}>
                    {buyDeals.map((item) => {
                      const active = watch('sourceBuyId') === item.id;
                      return (
                        <Pressable
                          key={item.id}
                          onPress={() => {
                            setValue('sourceBuyId', item.id, { shouldDirty: true });
                            setSourceOpen(false);
                          }}
                          style={[styles.sourceItem, active && styles.sourceItemActive]}
                        >
                          <AppText variant="small" tone={active ? 'white' : 'soft'}>{item.title}</AppText>
                          <AppText variant="small" tone={active ? 'white' : 'soft'}>{item.location}</AppText>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}

                {selectedSource ? (
                  <SectionCard style={styles.linkedCard}>
                    <AppText variant="small" tone="soft">Linked buy record</AppText>
                    <AppText variant="body">{selectedSource.title}</AppText>
                    <AppText variant="small" tone="soft">{selectedSource.location} - {selectedSource.areaSize}</AppText>
                    <AppText variant="small" tone="soft">Bought from: {selectedSource.purchasedFromName} - {selectedSource.purchasedFromPhone}</AppText>
                    <AppText variant="small" tone="soft">Purchase date: {selectedSource.purchaseDate}</AppText>
                    <LandDealMediaGrid
                      compact
                      items={[
                        { label: 'Land photo', uri: selectedSource.landImage },
                        { label: 'Aadhaar card', uri: selectedSource.aadhaarCardImage },
                        { label: 'Geo tag', uri: selectedSource.geoTagImage }
                      ]}
                    />
                  </SectionCard>
                ) : null}

                <View style={styles.row}>
                  <AppInput control={control} name="soldToName" label="Buyer name" placeholder="Buyer name" containerStyle={styles.flexField} />
                  <AppInput control={control} name="soldToPhone" label="Buyer phone" placeholder="9999999999" keyboardType="phone-pad" containerStyle={styles.flexField} />
                </View>
                <View style={styles.row}>
                  <AppInput control={control} name="soldToLocation" label="Buyer location" placeholder="Kupwara, Jammu and Kashmir" containerStyle={styles.flexField} />
                  <AppInput control={control} name="sellDate" label="Sell date" placeholder="YYYY-MM-DD" containerStyle={styles.flexField} />
                </View>
                <View style={styles.row}>
                  <AppInput control={control} name="sellPrice" label="Sell price" placeholder="1200000" keyboardType="numeric" containerStyle={styles.flexField} />
                  <View style={styles.flexField}>
                    <AppText variant="label">Buyer Aadhaar image</AppText>
                    <AppButton title="Upload buyer Aadhaar" variant="secondary" onPress={() => onUpload('soldToAadhaarImage')} />
                    <AppText variant="small" tone="soft" style={styles.helper}>
                      {watch('soldToAadhaarImage') ? 'Buyer Aadhaar image uploaded' : 'Upload the buyer Aadhaar card image.'}
                    </AppText>
                  </View>
                </View>
                <View style={styles.row}>
                  <AppInput control={control} name="soldToAadhaarNumber" label="Buyer Aadhaar number" placeholder="1234 5678 9012" containerStyle={styles.flexField} />
                  <View style={styles.flexField}>
                    <AppText variant="label">Profit preview</AppText>
                    <SectionCard style={styles.profitCard}>
                      <AppText variant="headline">
                        {selectedSource ? formatProfit(Number(watch('sellPrice') || 0) - Number(selectedSource.purchasePrice || 0)) : '-'}
                      </AppText>
                      <AppText variant="small" tone="soft">
                        Buy price: {selectedSource?.purchasePrice ?? '-'} - Sell price: {watch('sellPrice') || '-'}
                      </AppText>
                    </SectionCard>
                  </View>
                </View>
                <View style={styles.toggleRow}>
                  <AppText variant="label">Deal closed</AppText>
                  <Pressable
                    onPress={() => setValue('dealClosed', !watch('dealClosed'), { shouldDirty: true })}
                    style={[styles.toggleChip, watch('dealClosed') && styles.toggleChipActive]}
                  >
                    <AppText variant="small" tone={watch('dealClosed') ? 'white' : 'soft'}>
                      {watch('dealClosed') ? 'Closed' : 'Open'}
                    </AppText>
                  </Pressable>
                </View>
              </>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <AppButton title={mode === 'buy' ? 'Save buy record' : 'Save sell record'} onPress={onSave} />
            <AppButton title="Cancel" variant="secondary" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

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
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm
  },
  dropdown: {
    minHeight: 52,
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.surfaceSoft,
    paddingHorizontal: AppTheme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: AppTheme.spacing.sm
  },
  dropdownIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sourceList: {
    gap: AppTheme.spacing.sm
  },
  sourceItem: {
    padding: AppTheme.spacing.sm,
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.surfaceSoft,
    gap: 2
  },
  sourceItemActive: {
    backgroundColor: AppTheme.colors.primary
  },
  uploadButton: {
    flex: 1,
    minWidth: 150
  },
  linkedCard: {
    gap: 4,
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  profitCard: {
    gap: 4,
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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
  footer: {
    flexDirection: 'row',
    gap: AppTheme.spacing.sm,
    padding: AppTheme.spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: AppTheme.colors.border
  },
  helper: {
    marginTop: 6
  }
});
