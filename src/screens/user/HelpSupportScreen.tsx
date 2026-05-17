import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Screen } from '@/components/common/Screen';
import { PageHeader } from '@/components/layout/PageHeader';
import { SectionCard } from '@/components/layout/SectionCard';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { AppTheme } from '@/theme';
import { ROUTES } from '@/constants/navigation';
import { OWNER_LOCATION, OWNER_NAME, OWNER_PHONE_DISPLAY, OWNER_PHONE_TEL } from '@/constants/owner';
import { useAuthContext } from '@/context/AuthContext';
import { getAuthSession } from '@/services/tokenStorage';
import { useMySupportThreadQuery } from '@/store/api/supportApi';

const faqItems = [
  {
    title: 'Order not delivered',
    description: 'Track the order, check the latest status, and ask support to help with delays.'
  },
  {
    title: 'Return or exchange',
    description: 'Start a return request and share images in chat when support asks for proof.'
  },
  {
    title: 'Seller or account issue',
    description: 'Use support chat for approval, profile, login, or store-related questions.'
  }
];

export function HelpSupportScreen({ navigation }: any) {
  const { sessionReady } = useAuthContext();
  const tokenReady = Boolean(getAuthSession()?.token);
  const { data: thread } = useMySupportThreadQuery(undefined, {
    skip: !sessionReady || !tokenReady,
    refetchOnMountOrArgChange: true
  });

  const email = 'support@shopora.com';
  const supportMessages = thread?.messages ?? [];
  const lastMessage = supportMessages[supportMessages.length - 1];

  const openEmail = () => {
    void Linking.openURL(`mailto:${email}?subject=Shopora%20Support`);
  };

  const openPhone = () => {
    void Linking.openURL(`tel:${OWNER_PHONE_TEL}`);
  };

  return (
    <Screen>
      <PageHeader title="Help & Support" subtitle="Chat with Shopora support, check answers, and keep your orders moving." />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SectionCard style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View style={styles.heroIcon}>
              <MaterialCommunityIcons name="headset" size={24} color={AppTheme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="headline">We are here to help</AppText>
              <AppText variant="body" tone="soft">
                Reach out by chat for a fast reply, or use the contact details below.
              </AppText>
            </View>
          </View>
          <View style={styles.contactGrid}>
            <Pressable style={styles.contactCard} onPress={openEmail}>
              <Ionicons name="mail-outline" size={18} color={AppTheme.colors.primary} />
              <AppText variant="label">Email</AppText>
              <AppText variant="small" tone="soft">
                {email}
              </AppText>
            </Pressable>
            <Pressable style={styles.contactCard} onPress={openPhone}>
              <Ionicons name="call-outline" size={18} color={AppTheme.colors.primary} />
              <AppText variant="label">{OWNER_NAME}</AppText>
              <AppText variant="small" tone="soft">
                {OWNER_PHONE_DISPLAY}
              </AppText>
            </Pressable>
            <View style={styles.contactCard}>
              <Ionicons name="location-outline" size={18} color={AppTheme.colors.primary} />
              <AppText variant="label">Location</AppText>
              <AppText variant="small" tone="soft">
                {OWNER_LOCATION}
              </AppText>
            </View>
          </View>
          <AppButton title="Open Chat" onPress={() => navigation.navigate(ROUTES.SupportChat)} />
        </SectionCard>

        <SectionCard style={styles.threadCard}>
          <View style={styles.threadRow}>
            <View style={styles.threadIcon}>
              <Ionicons name="chatbubbles-outline" size={18} color={AppTheme.colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <AppText variant="title">Your support thread</AppText>
              <AppText variant="small" tone="soft">
                {thread?.status ?? 'OPEN'} · {thread?.subject ?? 'Support request'}
              </AppText>
            </View>
            <View style={styles.threadStatus}>
              <AppText variant="small" tone="white">
                {thread?.status ?? 'OPEN'}
              </AppText>
            </View>
          </View>
          <AppText variant="body" tone="soft">
            {lastMessage?.message ?? 'Start a chat to create your support thread.'}
          </AppText>
        </SectionCard>

        <SectionCard>
          <AppText variant="title">Common help topics</AppText>
          <View style={styles.faqList}>
            {faqItems.map((item) => (
              <View key={item.title} style={styles.faqItem}>
                <View style={styles.faqBullet}>
                  <Ionicons name="help-circle-outline" size={16} color={AppTheme.colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText variant="label">{item.title}</AppText>
                  <AppText variant="small" tone="soft">
                    {item.description}
                  </AppText>
                </View>
              </View>
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
    paddingBottom: AppTheme.spacing.xl + 80
  },
  heroCard: {
    gap: AppTheme.spacing.md
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.md
  },
  heroIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.primaryContainer
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppTheme.spacing.sm
  },
  contactCard: {
    flexBasis: '31%',
    minWidth: 150,
    gap: 6,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  threadCard: {
    gap: AppTheme.spacing.sm
  },
  threadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.md
  },
  threadIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.primaryContainer
  },
  threadStatus: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: AppTheme.radius.pill,
    backgroundColor: AppTheme.colors.success
  },
  faqList: {
    gap: AppTheme.spacing.sm
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: AppTheme.spacing.sm,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.radius.md,
    backgroundColor: AppTheme.colors.surfaceSoft
  },
  faqBullet: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppTheme.colors.surface
  }
});
