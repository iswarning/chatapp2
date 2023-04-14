import { db } from "@/firebase";

async function findChatByKeyWord(keyWord: string) {
    const snapshot = await db
        .collection('chats')
        .where('users', 'array-contains', keyWord)
        .get();
    const snapshot2 = await db
        .collection('users')
        .where('email', '==', keyWord)
        .get();
    const data = snapshot.docs;
    const data2 = snapshot2.docs;

    return data.concat(data2);
}

export default findChatByKeyWord;