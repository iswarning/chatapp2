import { db } from "@/firebase";

const getUserById = async (id: string) => 
    (await db.collection('users').doc(id).get()).data();

export default getUserById;