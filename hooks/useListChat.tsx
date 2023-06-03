import { db } from '@/firebase';
import { createDataHook } from 'next-data-hooks';

// this context is the GetStaticPropsContext from 'next'
//                                                      👇
const useListChat = createDataHook('ListChat', async () => {

  const ref = await db.collection('chats').get();

    const chats = ref?.docs

    return { chats };
});

export default useListChat;