import { db } from "@/firebase";

async function getFriendRequestsRecipientByEmail(recipientEmail: string) {
    let data = await db
        .collection('friend_requests')
        .where('recipientEmail', '==', recipientEmail)
        .where('isDelete', '==', false)
        .get();
    return data.docs || [];
}

export default getFriendRequestsRecipientByEmail;