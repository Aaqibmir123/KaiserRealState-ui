import React from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LinearGradient } from 'expo-linear-gradient';

import { Screen } from '@/components/common/Screen';
import { AppText } from '@/components/common/AppText';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/common/AppInput';
import { SectionCard } from '@/components/layout/SectionCard';
import { AppTheme } from '@/theme';
import { ROUTES } from '@/constants/navigation';
import { useRequestOtpMutation } from '@/store/api/authApi';
import { showFeedback } from '@/store/slices/feedbackSlice';
import { useAppDispatch } from '@/store/hooks';

const schema = z.object({
  identifier: z.string().min(8, 'Enter phone number')
});

type FormValues = z.infer<typeof schema>;
type Props = any;

export function LoginScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const { control, handleSubmit } = useForm();
  const dispatch = useAppDispatch();
  const [requestOtp, { isLoading }] = useRequestOtpMutation();
  const normalizePhone = (value: string) => value.replace(/\D/g, '').slice(-10);

  const onSubmit = handleSubmit((values: FormValues) => {
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      dispatch(showFeedback({
        type: 'error',
        title: 'Validation failed',
        message: parsed.error.issues[0]?.message ?? 'Please enter a valid phone number.'
      }));
      return;
    }

    requestOtp({ phone: normalizePhone(parsed.data.identifier) })
      .unwrap()
      .then((response: any) => {
        const payload = response?.data ?? response ?? {};
        const normalizedPhone = normalizePhone(parsed.data.identifier);
        dispatch(showFeedback({
          type: 'success',
          title: 'Code sent',
          message: 'Check your messages for the verification code.'
        }));
        navigation.navigate(ROUTES.Otp, {
          phone: normalizedPhone,
          devOtp: __DEV__ ? payload?.devOtp : undefined
        });
      })
      .catch((error: any) => {
        dispatch(showFeedback({
          type: 'error',
          title: 'Could not send OTP',
          message: error?.data?.message ?? 'Please try again.'
        }));
      });
  });

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.shell, width >= 768 && styles.shellWide]}>
          <LinearGradient colors={['#FFF2E8', '#FFF9F5', '#FFFDFB']} style={styles.hero}>
            <View style={styles.heroOrbs}>
              <View style={styles.orbA} />
              <View style={styles.orbB} />
            </View>
            <View style={styles.heroBadge}>
              <AppText variant="small" tone="white">Premium Marketplace</AppText>
            </View>
            <AppText variant="display" tone="primary" style={styles.brand}>Shopora</AppText>
            <AppText variant="body" tone="soft" style={styles.heroCopy}>
              Sign in with your phone number to continue shopping, manage orders, or open your seller workspace.
            </AppText>
            <View style={styles.featureRow}>
              <View style={styles.featurePill}><AppText variant="small" tone="soft">Fast OTP</AppText></View>
              <View style={styles.featurePill}><AppText variant="small" tone="soft">Secure login</AppText></View>
              <View style={styles.featurePill}><AppText variant="small" tone="soft">Seller ready</AppText></View>
            </View>
          </LinearGradient>

          <SectionCard style={styles.card}>
            <View style={styles.sectionTop}>
              <AppText variant="title">Sign in</AppText>
              <AppText variant="small" tone="soft">Enter your phone number and we&apos;ll send a one-time code.</AppText>
            </View>
            <AppInput
              control={control}
              name="identifier"
              label="Phone Number"
              prefix="+91"
              placeholder="9876543210"
              keyboardType="phone-pad"
              helperText="We will send a 6-digit OTP to this number."
            />
            <AppButton title="Send OTP" loading={isLoading} onPress={onSubmit} />
            <AppButton title="Forgot Password?" variant="ghost" onPress={() => navigation.navigate(ROUTES.ForgotPassword)} />
          </SectionCard>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: AppTheme.spacing.md,
    justifyContent: 'center',
    paddingBottom: AppTheme.spacing.xl
  },
  shell: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    gap: AppTheme.spacing.lg
  },
  shellWide: {
    maxWidth: 620
  },
  hero: {
    minHeight: 260,
    padding: AppTheme.spacing.lg,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: AppTheme.spacing.md,
    overflow: 'hidden',
    position: 'relative'
  },
  heroOrbs: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden'
  },
  orbA: {
    position: 'absolute',
    top: -28,
    right: -26,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.55)'
  },
  orbB: {
    position: 'absolute',
    left: -18,
    bottom: -26,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.35)'
  },
  heroBadge: {
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: 6,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: AppTheme.colors.primary
  },
  brand: {
    fontSize: 48,
    lineHeight: 54,
    fontWeight: '800'
  },
  heroCopy: {
    textAlign: 'center',
    maxWidth: 420
  },
  featureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm,
    justifyContent: 'center',
    marginTop: AppTheme.spacing.sm
  },
  featurePill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: 'rgba(255,255,255,0.65)'
  },
  card: {
    gap: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.lg
  },
  sectionTop: {
    gap: 4
  }
});
