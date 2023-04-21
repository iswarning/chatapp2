import { db } from "@/firebase";

async function getAllFriendOfUser(email: string) {

    let data = await db
        .collection('friends')
        .where('users', 'array-contains', email)
        .where('isDelete', '==', false)
        .get();

    return data.docs || [];
}

export default getAllFriendOfUser;