import { db } from "@/firebase";

async function findChatByKeyWord(keyWord: string) {
    let friendList = await db
        .collection('chats')
        .where('users', 'array-contains', keyWord)
        .get();
    return friendList.docs || [];
}

export default findChatByKeyWord;