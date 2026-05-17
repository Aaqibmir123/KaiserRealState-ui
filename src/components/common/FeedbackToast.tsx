import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { hideFeedback } from '@/store/slices/feedbackSlice';
import { AppTheme } from '@/theme';
import { AppText } from './AppText';

const typeStyles = {
  success: { backgroundColor: '#0F7A39' },
  error: { backgroundColor: '#B71C1C' },
  info: { backgroundColor: AppTheme.colors.primary }
} as const;

export function FeedbackToast() {
  const dispatch = useAppDispatch();
  const feedback = useAppSelector((state: any) => state.feedback);
  const toastType = (feedback.type in typeStyles ? feedback.type : 'info') as keyof typeof typeStyles;

  useEffect(() => {
    if (!feedback.visible) return undefined;
    const timer = setTimeout(() => dispatch(hideFeedback()), 2200);
    return () => clearTimeout(timer);
  }, [dispatch, feedback.visible, feedback.message, feedback.title, feedback.type]);

  if (!feedback.visible) {
    return null;
  }

  return (
    <Pressable onPress={() => dispatch(hideFeedback())} style={[styles.wrap, typeStyles[toastType]]}>
      <AppText variant="label" tone="white">{feedback.title}</AppText>
      {feedback.message ? <AppText variant="small" tone="white" style={styles.message}>{feedback.message}</AppText> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: AppTheme.spacing.md,
    right: AppTheme.spacing.md,
    bottom: AppTheme.spacing.lg,
    zIndex: 999,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.lg,
    ...AppTheme.shadow.card
  },
  message: {
    marginTop: 4,
    opacity: 0.92
  }
});
