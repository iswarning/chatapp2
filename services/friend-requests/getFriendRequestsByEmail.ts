import { db } from "@/firebase";

async function getFriendRequestsByEmail(recipientEmail: string) {
    let data = await db
        .collection('friend_requests')
        .where('recipientEmail', '==', recipientEmail)
        .where('accepted', '==', false)
        .where('deleted', '==', false)
        .get();
    return data.docs || [];
}

export default getFriendRequestsByEmail;