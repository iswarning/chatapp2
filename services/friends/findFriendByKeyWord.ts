import { db } from "@/firebase";

async function findFriendByKeyWord({ userId, keyWord }: any) {
    let data = await db.collection('users').doc(userId).collection('friends').get();
    return data.docs.find((friend) => friend.data().email == keyWord);
}

export default findFriendByKeyWord;