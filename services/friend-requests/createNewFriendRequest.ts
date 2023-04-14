import { db } from "@/firebase";
import firebase from "firebase";

export default function createNewFriendRequest(senderEmail: string, recipientEmail: string) {

    try {
        db
        .collection('friend_requests')
        .add({
            senderEmail: senderEmail,
            recipientEmail: recipientEmail,
            isAccept: false,
            isDelete: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    } catch (error) {
        throw new Error(JSON.stringify(error))
    }
}