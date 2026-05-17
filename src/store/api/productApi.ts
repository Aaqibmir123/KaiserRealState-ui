import { baseApi } from './baseApi';

export const productApi = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    getProducts: build.query({
      query: () => ({ url: '/products' })
    })
  })
});

export const { useGetProductsQuery } = productApi;
