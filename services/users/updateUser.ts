import { db } from "@/firebase";
import firebase from "firebase";

export default function UpdateUser(user: any) {
    try {
        db.collection('users').doc(user?.uid).set(
            {
                email: user?.email,
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
                photoURL: user?.photoURL,
                fullName: user?.displayName
            },
            { merge: true }
        )
    } catch (error) {
        throw new Error(JSON.stringify(error))
    }
}