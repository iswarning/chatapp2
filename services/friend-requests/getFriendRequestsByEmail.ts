import { db } from "@/firebase";

async function getFriendRequestsByEmail(senderEmail: string, recipientEmail: string) {
    let data = await db
        .collection('friend_requests')
        .where('senderEmail', '==', senderEmail)
        .where('recipientEmail', '==', recipientEmail)
        .where('isAccept', '==', false)
        .where('isDelete', '==', false)
        .get();
    return data.docs || [];
}

export default getFriendRequestsByEmail;