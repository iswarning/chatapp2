import { db } from "@/firebase";
import firebase from "firebase";

export default async function updateOnlineTime(userId: string) {
    try {
        await db.collection('users').doc(userId).set({
            lastOnline: firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    } catch(error) {
        throw new Error(JSON.stringify(error));
    }
}