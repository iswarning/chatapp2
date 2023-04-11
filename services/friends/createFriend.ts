import { db } from "@/firebase";
import firebase from "firebase";

async function createFriend({ senderEmail, recipientEmail }: any) {

    try {
        db
        .collection('friends')
        .add({
            users: [senderEmail, recipientEmail],
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            accepted: false,
            deleted: false
        });
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
    
}

export default createFriend;