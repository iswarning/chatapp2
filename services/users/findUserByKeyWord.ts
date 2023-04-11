import { db } from "@/firebase";

async function findUserByKeyWord(keyWord: string) {
    let data = await db
        .collection('users')
        .where('email', '==', keyWord)
        .get();
    return data.docs || [];
}

export default findUserByKeyWord;