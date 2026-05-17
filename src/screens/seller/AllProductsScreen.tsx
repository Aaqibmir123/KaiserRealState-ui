import React from 'react';

import { SellerProductListScreen } from '@/screens/seller/SellerProductListScreen';

export function AllProductsScreen(props: any) {
  return (
    <SellerProductListScreen
      {...props}
      showAddButton={false}
      route={{
        ...(props.route ?? {}),
        params: {
          title: 'All Products',
          subtitle: 'See every live, draft, low stock, and out of stock item in one place.'
        }
      }}
    />
  );
}
