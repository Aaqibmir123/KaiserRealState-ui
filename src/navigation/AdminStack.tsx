import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from '@/constants/navigation';
import { AdminTabsNavigator } from './AdminTabsNavigator';
import { UserManagementPreviewScreen } from '@/screens/admin-preview/UserManagementPreviewScreen';
import { ProductModerationScreen } from '@/screens/admin-preview/ProductModerationScreen';
import { LandDealManagementScreen } from '@/screens/admin-preview/LandDealManagementScreen';
import { AdminTestimonialsScreen } from '@/screens/admin-preview/AdminTestimonialsScreen';
import { AdminSupportInboxScreen } from '@/screens/admin-preview/AdminSupportInboxScreen';
import { AdminSupportThreadScreen } from '@/screens/admin-preview/AdminSupportThreadScreen';

const Stack = createNativeStackNavigator();

export function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs" component={AdminTabsNavigator} />
      <Stack.Screen name="UserManagement" component={UserManagementPreviewScreen} />
      <Stack.Screen name="ProductModeration" component={ProductModerationScreen} />
      <Stack.Screen name={ROUTES.LandDeals} component={LandDealManagementScreen} />
      <Stack.Screen name={ROUTES.AdminTestimonials} component={AdminTestimonialsScreen} />
      <Stack.Screen name={ROUTES.AdminSupportInbox} component={AdminSupportInboxScreen} />
      <Stack.Screen name={ROUTES.AdminSupportThread} component={AdminSupportThreadScreen} />
    </Stack.Navigator>
  );
}
