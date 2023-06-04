import { db } from "@/firebase";
import firebase from "firebase";

async function createNewUser(user: firebase.User) {
    try {
        db.collection('users').doc(user?.uid).update(
            {
                isOnline: true
            }
        )
    } catch (error) {
        throw new Error(JSON.stringify(error))
    }
}

export default createNewUser;