import { db } from "@/firebase";

async function findFriendByEmail(emailLoggedIn: string, emailIsFriend: string) {
    let friendList = await db
        .collection('friends')
        .where('users', 'array-contains', emailLoggedIn)
        .where('users', 'array-contains', emailIsFriend)
        .get();
    return friendList.docs || [];
}

export default findFriendByEmail;