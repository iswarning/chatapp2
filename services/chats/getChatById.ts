import { db } from "@/firebase";

export default async function getChatById(id: string) {
    const data = await db.collection('chats').doc(id).get();
    return data || null;
}