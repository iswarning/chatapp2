import { db } from "@/firebase";

async function getChatByEmail(email: string) {
    let data = await db
        .collection('chats')
        .where('users', 'array-contains', email)
        .get();
    return data.docs || [];
}

export default getChatByEmail;