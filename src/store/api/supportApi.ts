import { baseApi } from './baseApi';

export const supportApi = baseApi.injectEndpoints({
  endpoints: (build: any) => ({
    mySupportThread: build.query({
      query: () => ({ url: '/support/me', method: 'GET' }),
      transformResponse: (response: any) => response.data,
      providesTags: ['Support']
    }),
    mySupportMessages: build.query({
      query: () => ({ url: '/support/me/messages', method: 'GET' }),
      transformResponse: (response: any) => response.data,
      providesTags: ['Support']
    }),
    sendMySupportMessage: build.mutation({
      query: (body: { message: string; attachmentUrl?: string | null }) => ({ url: '/support/me/messages', method: 'POST', body }),
      invalidatesTags: ['Support']
    }),
    adminSupportThreads: build.query({
      query: () => ({ url: '/support/admin/threads', method: 'GET' }),
      transformResponse: (response: any) => response.data,
      providesTags: ['Support']
    }),
    adminSupportThread: build.query({
      query: (threadId: string) => ({ url: `/support/admin/threads/${threadId}/messages`, method: 'GET' }),
      transformResponse: (response: any) => response.data,
      providesTags: ['Support']
    }),
    sendAdminSupportMessage: build.mutation({
      query: ({ threadId, message, attachmentUrl }: { threadId: string; message: string; attachmentUrl?: string | null }) => ({
        url: `/support/admin/threads/${threadId}/messages`,
        method: 'POST',
        body: { message, attachmentUrl }
      }),
      invalidatesTags: ['Support']
    }),
    updateAdminSupportThread: build.mutation({
      query: ({ threadId, status }: { threadId: string; status: string }) => ({
        url: `/support/admin/threads/${threadId}`,
        method: 'PATCH',
        body: { status }
      }),
      invalidatesTags: ['Support']
    })
  })
});

export const {
  useMySupportThreadQuery,
  useMySupportMessagesQuery,
  useSendMySupportMessageMutation,
  useAdminSupportThreadsQuery,
  useAdminSupportThreadQuery,
  useSendAdminSupportMessageMutation,
  useUpdateAdminSupportThreadMutation
} = supportApi;
