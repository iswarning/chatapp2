import { db } from "@/firebase";

async function getAllFriendOfUser(email: string) {

    let data = await db
        .collection('friends')
        .where('users', 'array-contains', email)
        .get();

    return data.docs || [];
}

export default getAllFriendOfUser;