import { db } from "@/firebase";

async function getAllFriendCurrentUser({ emailLoggedIn }: any) {

    let data = await db.collection('friends').where('users', 'array-contains', emailLoggedIn).get();

    return data.docs || [];
}

export default getAllFriendCurrentUser;