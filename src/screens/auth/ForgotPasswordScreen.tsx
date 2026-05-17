import React from 'react';
import { View, StyleSheet } from 'react-native';

import { FeatureScreen } from '@/screens/common/FeatureScreen';

export function ForgotPasswordScreen() {
  return (
    <FeatureScreen
      title="Forgot Password"
      subtitle="Password recovery is UI-ready and can later connect to OTP or email reset flows."
      note="We keep this screen simple and safe for now so it can be wired to backend auth without changing the structure."
      actionLabel="Back to Login"
    />
  );
}
