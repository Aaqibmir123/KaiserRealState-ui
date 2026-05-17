import React from 'react';

import { useAuthContext } from '@/context/AuthContext';
import { getAuthSession } from '@/services/tokenStorage';
import {
  useMySupportMessagesQuery,
  useSendMySupportMessageMutation
} from '@/store/api/supportApi';
import { SupportChatView } from '@/components/support/SupportChatView';

export function SupportChatScreen() {
  const { sessionReady } = useAuthContext();
  const session = getAuthSession();
  const tokenReady = Boolean(session?.token);
  const { data: thread, isFetching, refetch } = useMySupportMessagesQuery(undefined, {
    skip: !sessionReady || !tokenReady,
    refetchOnMountOrArgChange: true
  });
  const [sendMessage, { isLoading: sending }] = useSendMySupportMessageMutation();

  const messages = thread?.messages ?? [];

  const handleSend = async (message: string, attachmentUrl?: string) => {
    await sendMessage({ message, attachmentUrl }).unwrap();
  };

  const currentRole = session?.role === 'seller' ? 'SELLER' : session?.role === 'admin' ? 'ADMIN' : 'SHOPPER';

  return (
    <SupportChatView
      title="Support Chat"
      subtitle="Talk to Shopora support about orders, login, seller approvals, or returns."
      status={thread?.status}
      messages={messages}
      currentRole={currentRole}
      onSend={handleSend}
      sending={sending}
      loading={isFetching && !thread}
      onRefresh={() => void refetch()}
      placeholder="Type your issue, order number, or question"
      helperText="Support usually replies in a few minutes during working hours."
      emptyTitle="No message yet"
      emptySubtitle="Send your first message and our support team will reply here."
    />
  );
}
