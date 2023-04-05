import { db } from "@/firebase";

async function getAllFriendCurrentUser({ userId }: any) {

    let data = await db.collection('users').doc(userId).collection('friends').get();

    return data.docs || [];
}

export default getAllFriendCurrentUser;