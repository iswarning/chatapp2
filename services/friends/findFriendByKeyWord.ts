import { db } from "@/firebase";

async function findFriendByKeyWord({ emailLoggedIn, keyWord }: any) {
    let friendList = await db
        .collection('friends')
        .where('users', 'array-contains', emailLoggedIn)
        .where('users', 'array-contains', keyWord)
        .get();
    return friendList.docs || [];
}

export default findFriendByKeyWord;