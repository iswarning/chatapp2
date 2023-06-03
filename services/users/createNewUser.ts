import { db } from "@/firebase";
import firebase from "firebase";

async function createNewUser(user: firebase.User) {
    try {
        db.collection('users').doc(user?.uid).set(
            {
                email: user?.email,
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
                photoURL: user?.photoURL,
                fullName: user?.displayName,
                isOnline: true
            },
            { merge: true }
        )
    } catch (error) {
        throw new Error(JSON.stringify(error))
    }
}

export default createNewUser;