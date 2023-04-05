import { db } from "@/firebase";
import firebase from "firebase";

const createFriend = ({ senderId, senderEmail, recipientId, recipientEmail }: any) => {

    try {
        db
        .collection('users')
        .doc(senderId)
        .collection('friends')
        .add({
            userId: recipientId,
            email: recipientEmail,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        db
        .collection('users')
        .doc(recipientId)
        .collection('friends')
        .add({
            userId: senderId,
            email: senderEmail,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
    
}

export default createFriend;