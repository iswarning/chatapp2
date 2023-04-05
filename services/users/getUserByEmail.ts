import { db } from "@/firebase";

const getUserByEmail = async (email: string) => 
    (await db.collection('users').where('email', '==', email).get()).docs?.[0];

export default getUserByEmail;