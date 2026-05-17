import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ROUTES } from '@/constants/navigation';
import { SellerGateScreen } from '@/screens/seller/SellerGateScreen';
import { SellerRegistrationScreen } from '@/screens/seller/SellerRegistrationScreen';
import { ApprovalPendingScreen } from '@/screens/seller/ApprovalPendingScreen';
import { AddProductScreen } from '@/screens/seller/AddProductScreen';
import { AllProductsScreen } from '@/screens/seller/AllProductsScreen';
import { StoreDetailsScreen } from '@/screens/seller/StoreDetailsScreen';
import { SellerTabsNavigator } from './SellerTabsNavigator';

const Stack = createNativeStackNavigator();

export function SellerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.SellerGate} component={SellerGateScreen} />
      <Stack.Screen name={ROUTES.SellerRegistration} component={SellerRegistrationScreen} />
      <Stack.Screen name={ROUTES.ApprovalPending} component={ApprovalPendingScreen} />
      <Stack.Screen name={ROUTES.SellerWorkspace} component={SellerTabsNavigator} />
      <Stack.Screen name={ROUTES.AddProduct} component={AddProductScreen} />
      <Stack.Screen name={ROUTES.AllProducts} component={AllProductsScreen} />
      <Stack.Screen name={ROUTES.StoreDetails} component={StoreDetailsScreen} />
    </Stack.Navigator>
  );
}
