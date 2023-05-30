import { db } from "@/firebase";

export default async function getStatusFriend(emailLoggedIn: string, emailIsFriend: string) {

    let status = 'isStranger';

    const friendRequestsByEmail = await db
            .collection("friend_requests")
            .where("senderEmail",'==',emailLoggedIn)
            .where("recipientEmail",'==',emailIsFriend)
            .get();

    if(friendRequestsByEmail) {
        status = 'isFriendRequest';
    }

    const friendRequestsRecipientByEmail = await db
            .collection("friend_requests")
            .where("recipientEmail",'==',emailLoggedIn)
            .where("senderEmail",'==',emailIsFriend)
            .get();

    if(friendRequestsRecipientByEmail) {
        status = 'isPendingAccept';
    }

    const friendByEmails = await db
            .collection("friends")
            .where("users",'array-contains',emailLoggedIn)
            .get();

    if(friendByEmails) {
        friendByEmails?.docs?.find((fr) => fr.data().user.includes(emailIsFriend))
        status = 'isFriend';
    }

    return status;
}