import { db } from "@/firebase";

async function getAllUser() {

    let data = await db
        .collection('users')
        .get();
    return data.docs || [];
}

export default getAllUser;