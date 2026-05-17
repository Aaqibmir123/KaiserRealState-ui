import React from 'react';

import { SupportChatView } from '@/components/support/SupportChatView';
import { useAdminSupportThreadQuery, useSendAdminSupportMessageMutation } from '@/store/api/supportApi';

export function AdminSupportThreadScreen({ route }: any) {
  const threadId = String(route.params?.threadId ?? '');
  const { data: thread, isFetching, refetch } = useAdminSupportThreadQuery(threadId, {
    skip: !threadId,
    refetchOnMountOrArgChange: true
  });
  const [sendMessage, { isLoading: sending }] = useSendAdminSupportMessageMutation();

  const handleSend = async (message: string, attachmentUrl?: string) => {
    await sendMessage({ threadId, message, attachmentUrl }).unwrap();
  };

  return (
    <SupportChatView
      title="User Support"
      subtitle={thread?.user?.name ?? thread?.user?.phone ?? 'Customer ticket'}
      status={thread?.status}
      messages={thread?.messages ?? []}
      currentRole="ADMIN"
      onSend={handleSend}
      sending={sending}
      loading={isFetching && !thread}
      onRefresh={() => void refetch()}
      placeholder="Write the support reply"
      helperText="Mark the thread resolved once the user is happy."
      emptyTitle="Waiting for user messages"
      emptySubtitle="As soon as the customer writes here, the full conversation appears in this thread."
    />
  );
}
