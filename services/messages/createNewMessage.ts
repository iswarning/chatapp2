import { db } from "@/firebase";
import firebase from "firebase";

export default async function createNewMessage(chatId: string, message: string, senderEmail: string, photoURL: string) {
    try {
        await db.collection('chats').doc(chatId).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: message,
            user: senderEmail,
            photoURL: photoURL
        });
    } catch (error) {
        throw new Error(JSON.stringify(error))
    }
}