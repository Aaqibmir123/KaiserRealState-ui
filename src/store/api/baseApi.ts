import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuthSession, getAuthToken, hydrateAuthSession, setAuthSession } from '@/services/tokenStorage';
import { normalizeAuthRole } from '@/utils/auth';
import { store } from '@/store/store';
import { setSession } from '@/store/slices/authSlice';
import { setRole } from '@/store/slices/uiSlice';

const baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://10.51.139.173:4000/api';
const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers: any) => {
    headers.set('accept', 'application/json');
    const token = getAuthToken() ?? getAuthSession()?.token ?? null;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  }
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  if (!getAuthToken()) {
    const hydrated = await hydrateAuthSession();
    if (hydrated?.token) {
      store.dispatch(setSession(hydrated));
      store.dispatch(setRole(normalizeAuthRole(hydrated.role ?? 'shopper')));
    }
  }

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const session = getAuthSession();
    const refreshToken = session?.refreshToken;
    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        {
          url: '/auth/refresh',
          method: 'POST',
          body: { refreshToken }
        },
        api,
        extraOptions
      );

      if (refreshResult?.data) {
        const next = refreshResult.data as any;
        const nextSession = {
          token: next.token ?? session.token,
          refreshToken: next.refreshToken ?? refreshToken,
          phone: session.phone ?? next.user?.phone ?? null,
          role: normalizeAuthRole(next.user?.role ?? session.role ?? 'shopper')
        };
        await setAuthSession(nextSession);
        store.dispatch(setSession(nextSession));
        store.dispatch(setRole(nextSession.role ?? 'shopper'));
        result = await rawBaseQuery(args, api, extraOptions);
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'baseApi',
  keepUnusedDataFor: 120,
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Product', 'Category', 'Cart', 'Order', 'Seller', 'Admin', 'Address', 'Support', 'Return', 'Testimonial'],
  endpoints: () => ({})
});
