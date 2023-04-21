import { db } from "@/firebase";
import firebase from "firebase";

function createFriend(senderEmail: string, recipientEmail: string) {

    try {
        db
        .collection('friends')
        .add({
            users: [senderEmail, recipientEmail],
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            isDelete: false
        });
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
    
}

export default createFriend;