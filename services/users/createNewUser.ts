import { db } from "@/firebase";
import firebase from "firebase";

async function createNewUser(user: firebase.User, fcm_token: any) {
    await db.collection('users').doc(user?.uid).set(
        {
            email: user?.email,
            photoURL: user?.photoURL,
            fullName: user?.displayName,
            fcm_token: fcm_token
        }
    ).catch(err => console.log(err))
}

export default createNewUser;