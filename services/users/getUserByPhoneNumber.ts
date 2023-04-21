import { db } from "@/firebase";

async function getUserByPhoneNumber(phoneNumber: string) {
    let data = await db
        .collection('users')
        .where('phoneNumber', '==', phoneNumber)
        .get();
    return data?.docs?.[0] || null;
}

export default getUserByPhoneNumber;