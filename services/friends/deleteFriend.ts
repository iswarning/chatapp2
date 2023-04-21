import { db } from "@/firebase";

async function deleteFriend(friendId: string) {

    try {
        db
        .collection('friends')
        .doc(friendId)
        .set({
            isDelete: true
        });
    } catch (error) {
        throw new Error(JSON.stringify(error));
    }
    
}

export default deleteFriend;