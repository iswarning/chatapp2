import { db } from "@/firebase";

export default async function getMessagesByChatId(chatId: string) {
    const data = await db
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .orderBy('timestamp')
        .get();
    return data?.docs || [];
}