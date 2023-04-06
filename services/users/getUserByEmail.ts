import { db } from "@/firebase";

async function getUserByEmail(email: string) {
    let data = await db.collection('users').where('email', '==', email).get();
    return data.docs?.[0];
}

export default getUserByEmail;