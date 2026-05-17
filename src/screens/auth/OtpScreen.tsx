import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions
} from 'react-native';

import { Screen } from '@/components/common/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { AppTheme } from '@/theme';
import { ROUTES } from '@/constants/navigation';
import { useVerifyOtpMutation } from '@/store/api/authApi';
import { useAppDispatch } from '@/store/hooks';
import { setSession } from '@/store/slices/authSlice';
import { showFeedback } from '@/store/slices/feedbackSlice';
import { setAuthSession } from '@/services/tokenStorage';
import { setRole } from '@/store/slices/uiSlice';
import { normalizeAuthRole } from '@/utils/auth';

type Props = any;

const OTP_LENGTH = 6;

export function OtpScreen({ navigation, route }: Props) {
  const [code, setCode] = useState(String(route?.params?.devOtp ?? '').replace(/\D/g, '').slice(0, OTP_LENGTH));
  const phone = String(route?.params?.phone ?? '').replace(/\D/g, '').slice(-10);
  const dispatch = useAppDispatch();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const inputRef = useRef<RNTextInput | null>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    const next = String(route?.params?.devOtp ?? '').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (next) {
      setCode(next);
    }
  }, [route?.params?.devOtp]);

  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(timer);
  }, []);

  const digits = useMemo(() => Array.from({ length: OTP_LENGTH }, (_, index) => code[index] ?? ''), [code]);
  const isComplete = code.length === OTP_LENGTH;
  const horizontalPadding = AppTheme.spacing.md * 2;
  const gap = AppTheme.spacing.sm;
  const cellSize = Math.max(42, Math.min(52, Math.floor((width - horizontalPadding - gap * (OTP_LENGTH - 1)) / OTP_LENGTH)));

  const handleSubmit = async () => {
    if (!phone || code.length !== OTP_LENGTH) {
      dispatch(showFeedback({ type: 'error', title: 'Invalid OTP', message: 'Enter the 6-digit code first.' }));
      return;
    }

    try {
      const response = await verifyOtp({ phone, code }).unwrap();
      const payload = response?.data ?? response ?? {};
      const backendRole = normalizeAuthRole(payload?.user?.role);
      const role = backendRole;
      const nextSession = {
        token: payload.token,
        refreshToken: payload.refreshToken ?? null,
        phone: payload?.user?.phone ?? phone,
        role
      };

      if (!nextSession.token) {
        throw new Error('Missing token from server');
      }

      await setAuthSession(nextSession);
      dispatch(setSession(nextSession));
      dispatch(setRole(role));
      dispatch(showFeedback({ type: 'success', title: 'Verified', message: 'You are now signed in.' }));

      if (role === 'seller') {
        navigation.replace(ROUTES.SellerStack);
        return;
      }
      if (role === 'admin') {
        navigation.replace(ROUTES.AdminStack);
        return;
      }
      navigation.replace(ROUTES.MainTabs);
    } catch (error: any) {
      dispatch(showFeedback({
        type: 'error',
        title: 'OTP verification failed',
        message: error?.data?.message ?? 'Please check the code and try again.'
      }));
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.wrap}>
          <PageHeader title="Verify OTP" subtitle={`Enter the code sent to ${phone ? `+91 ${phone}` : 'your phone'}.`} />

          <View style={styles.card}>
            <View style={styles.banner}>
              <AppText variant="label" tone="primary">Secure Sign In</AppText>
              <AppText variant="headline">6-digit OTP</AppText>
              <AppText variant="small" tone="soft">
                We sent a verification code to your phone. Enter it below to continue.
              </AppText>
              {__DEV__ && route?.params?.devOtp ? (
                <View style={styles.devChip}>
                  <AppText variant="small" tone="white">
                    Dev OTP: {String(route.params.devOtp).replace(/\D/g, '').slice(0, OTP_LENGTH)}
                  </AppText>
                </View>
              ) : null}
            </View>

            <Pressable
              onPressIn={() => {
                inputRef.current?.focus();
              }}
              style={styles.otpRow}
            >
              {digits.map((digit, index) => {
                const active = index === code.length;
                return (
                  <View
                    key={`${index}-${digit}`}
                    style={[
                      styles.otpCell,
                      { width: cellSize, height: cellSize + 6 },
                      active ? styles.otpCellActive : null
                    ]}
                  >
                    <AppText variant="display" style={styles.otpDigit}>{digit || '•'}</AppText>
                  </View>
                );
              })}
            </Pressable>

            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={(value) => setCode(value.replace(/\D/g, '').slice(0, OTP_LENGTH))}
              placeholder="Enter code"
              keyboardType="number-pad"
              maxLength={OTP_LENGTH}
              textContentType="oneTimeCode"
              autoComplete="sms-otp"
              autoFocus
              showSoftInputOnFocus
              caretHidden
              style={styles.hiddenInput}
            />

            <AppText variant="small" tone="soft" style={styles.helper}>
              {isComplete ? 'Code ready to verify.' : 'Tap the boxes and type 6 digits.'}
            </AppText>

            <AppButton title="Verify & Continue" loading={isLoading} onPress={handleSubmit} />
            <AppButton title="Resend Code" variant="secondary" onPress={() => undefined} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  wrap: {
    flex: 1,
    padding: AppTheme.spacing.md,
    justifyContent: 'center'
  },
  card: {
    gap: AppTheme.spacing.md,
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.radius.lg,
    padding: AppTheme.spacing.lg,
    ...AppTheme.shadow.card
  },
  banner: {
    gap: AppTheme.spacing.xs
  },
  devChip: {
    alignSelf: 'flex-start',
    marginTop: AppTheme.spacing.xs,
    paddingHorizontal: AppTheme.spacing.sm,
    paddingVertical: 6,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: AppTheme.colors.primary
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: AppTheme.spacing.sm,
    flexWrap: 'nowrap'
  },
  otpCell: {
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.surfaceSoft,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  otpCellActive: {
    borderColor: AppTheme.colors.primary,
    backgroundColor: '#FFF4E8'
  },
  otpDigit: {
    fontSize: 24,
    lineHeight: 28,
    fontWeight: '800'
  },
  hiddenInput: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 160,
    height: 56,
    opacity: 0.02
  },
  helper: {
    textAlign: 'center'
  }
});
