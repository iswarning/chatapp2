import { db } from "@/firebase";

async function getFriendRequestsByEmail({ emailLoggedIn }: any) {
    let data = await db
        .collection('friend_requests')
        .where('users', 'array-contains', emailLoggedIn)
        .where('is_accept', 'array-contains', false)
        .where('is_delete', 'array-contains', false)
        .get();
    return data.docs || [];
}

export default getFriendRequestsByEmail;