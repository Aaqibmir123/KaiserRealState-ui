import React, { useEffect } from 'react';
import { Image } from 'expo-image';
import { ScrollView, StyleSheet, View, Pressable } from 'react-native';
import { useForm } from 'react-hook-form';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Screen } from '@/components/common/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionCard } from '@/components/layout/SectionCard';
import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { AppTheme } from '@/theme';
import { ROUTES } from '@/constants/navigation';
import { useMeQuery, useUpdateMeMutation } from '@/store/api/authApi';
import { pickAndUploadImage } from '@/services/imageUpload';
import { showFeedback } from '@/store/slices/feedbackSlice';
import { useAppDispatch } from '@/store/hooks';
import { getAuthSession, setAuthSession } from '@/services/tokenStorage';
import { setSession } from '@/store/slices/authSlice';
import { useAuthContext } from '@/context/AuthContext';
import { OWNER_LOCATION, OWNER_NAME, OWNER_PHONE_DISPLAY } from '@/constants/owner';

const quickLinks = [
  { title: 'Testimonials', subtitle: 'Client reviews and ratings', route: ROUTES.AdminTestimonials, icon: 'chat-quote-outline' },
  { title: 'Support Inbox', subtitle: 'Messages and requests', route: ROUTES.AdminSupportInbox, icon: 'headset' },
  { title: 'Land Deals', subtitle: 'Buy and sell records', route: ROUTES.LandDeals, icon: 'map-outline' }
] as const;

export function AdminProfileScreen({ navigation }: any) {
  const dispatch = useAppDispatch();
  const { sessionReady } = useAuthContext();
  const { data } = useMeQuery(undefined, {
    skip: !sessionReady,
    refetchOnMountOrArgChange: true
  });
  const [updateMe, { isLoading }] = useUpdateMeMutation();
  const { control, handleSubmit, reset, setValue, watch } = useForm();

  useEffect(() => {
    reset({
      name: '',
      email: '',
      phone: '',
      avatarUrl: ''
    });
  }, [reset]);

  useEffect(() => {
    const user = data?.data;
    if (!user) return;
    reset({
      name: user.name ?? OWNER_NAME,
      email: user.email ?? '',
      phone: user.phone ?? '',
      avatarUrl: user.avatarUrl ?? ''
    });
  }, [data?.data, reset]);

  const avatarUrl = watch('avatarUrl');

  const navigateTo = (route: string) => {
    const parent = navigation.getParent?.();
    if (parent?.navigate) {
      parent.navigate(route as never);
      return;
    }
    navigation.navigate(route as never);
  };

  const uploadAvatar = async () => {
    try {
      const url = await pickAndUploadImage();
      if (!url) return;
      setValue('avatarUrl', url, { shouldDirty: true, shouldValidate: true });
      dispatch(showFeedback({ type: 'success', title: 'Photo uploaded', message: 'Profile picture attached.' }));
    } catch (error: any) {
      dispatch(showFeedback({ type: 'error', title: 'Upload failed', message: error?.message ?? 'Try again.' }));
    }
  };

  const onSubmit = handleSubmit(async (values: { name?: string; email?: string; phone?: string; avatarUrl?: string }) => {
    if (!values.name?.trim() || !values.email?.trim() || !values.phone?.trim()) {
      dispatch(showFeedback({ type: 'error', title: 'Missing details', message: 'Add name, email, and phone.' }));
      return;
    }

    try {
      const response = await updateMe({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        avatarUrl: values.avatarUrl?.trim() || undefined
      }).unwrap();

      const nextUser = response?.data ?? {};
      const currentSession = getAuthSession();
      const nextSession = {
        token: currentSession?.token ?? '',
        refreshToken: currentSession?.refreshToken ?? null,
        phone: nextUser.phone ?? values.phone.trim(),
        role: currentSession?.role ?? 'shopper'
      };
      if (nextSession.token) {
        await setAuthSession(nextSession as any);
        dispatch(setSession(nextSession as any));
      }

      dispatch(showFeedback({ type: 'success', title: 'Profile saved', message: 'Admin profile updated.' }));
    } catch (error: any) {
      dispatch(showFeedback({ type: 'error', title: 'Save failed', message: error?.data?.message ?? 'Could not update profile.' }));
    }
  });

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <PageHeader title="Admin profile" subtitle="Update your visible profile, phone, email, and picture." />

        <SectionCard style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              {avatarUrl ? (
                <Image source={{ uri: avatarUrl }} style={styles.avatarImage} contentFit="cover" />
              ) : (
                <Ionicons name="person-circle-outline" size={54} color={AppTheme.colors.primary} />
              )}
            </View>
            <AppButton title="Upload photo" variant="secondary" onPress={() => void uploadAvatar()} />
          </View>

          <View style={styles.summary}>
            <AppText variant="headline">{watch('name') || OWNER_NAME}</AppText>
            <AppText variant="body" tone="soft">{watch('phone') || OWNER_PHONE_DISPLAY}</AppText>
            <AppText variant="small" tone="soft">{OWNER_LOCATION}</AppText>
            <AppText variant="small" tone="soft">{watch('email') || 'Email not set'}</AppText>
          </View>
        </SectionCard>

        <SectionCard style={styles.formCard}>
          <AppText variant="title">Edit profile</AppText>
          <View style={styles.form}>
            <AppInput control={control} name="name" label="Name" placeholder={OWNER_NAME} />
            <AppInput control={control} name="email" label="Email" placeholder="you@example.com" keyboardType="email-address" autoCapitalize="none" />
            <AppInput control={control} name="phone" label="Phone" placeholder="7889893844" keyboardType="phone-pad" />
          </View>
          <AppButton title="Save profile" loading={isLoading} onPress={onSubmit} />
        </SectionCard>

        <SectionCard>
          <AppText variant="title">Quick links</AppText>
          <View style={styles.quickGrid}>
            {quickLinks.map((item) => (
              <Pressable key={item.title} onPress={() => navigateTo(item.route)} style={styles.quickCard}>
                <View style={styles.quickIcon}>
                  <MaterialCommunityIcons name={item.icon as any} size={20} color={AppTheme.colors.primary} />
                </View>
                <AppText variant="title">{item.title}</AppText>
                <AppText variant="small" tone="soft">{item.subtitle}</AppText>
              </Pressable>
            ))}
          </View>
        </SectionCard>
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
  profileCard: {
    gap: AppTheme.spacing.md,
    alignItems: 'center'
  },
  avatarWrap: {
    gap: AppTheme.spacing.md,
    alignItems: 'center'
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  avatarImage: {
    width: '100%',
    height: '100%'
  },
  summary: {
    alignItems: 'center',
    gap: 4
  },
  formCard: {
    gap: AppTheme.spacing.md
  },
  form: {
    gap: AppTheme.spacing.md
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm
  },
  quickCard: {
    width: '48%',
    gap: 8,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.surface
  }
});
