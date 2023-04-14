import { db } from "@/firebase";

async function getUserById(id: any) {
    let data = await db
        .collection('users')
        .doc(id)
        .get();
    return data.data() || [];
}

export default getUserById;