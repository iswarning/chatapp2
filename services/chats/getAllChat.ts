import { db } from "@/firebase";

async function getAllChat() {
    let data = await db
        .collection("chats")
        .get();
    return data.docs || [];
}

export default getAllChat;