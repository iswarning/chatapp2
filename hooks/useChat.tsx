import { db } from '@/firebase';
import { createDataHook } from 'next-data-hooks';

// this context is the GetStaticPropsContext from 'next'
//                                                      👇
const useChatMessage = createDataHook('ChatMessage', async (context) => {
  const chatId = context.params?.id as string;

  const ref = db.collection('chats').doc(chatId);
    const messagesRes = await ref.collection('messages').orderBy('timestamp', 'asc').get();
    const messages = messagesRes.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }))
    .map((messages: any) => ({
        ...messages,
        timestamp: messages.timestamp.toDate().getTime(),
    }));

    const chatRes = await ref.get();
    const chat = {
        id: chatRes.id,
        ...chatRes.data()
    };

    return { chat, messages };
});

export default useChatMessage;