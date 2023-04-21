import { db } from "@/firebase";

async function getFriendRequestsSenderByEmail(senderEmail: string) {
    let data = await db
        .collection('friend_requests')
        .where('senderEmail', '==', senderEmail)
        .where('isDelete', '==', false)
        .get();
    return data.docs || [];
}

export default getFriendRequestsSenderByEmail;