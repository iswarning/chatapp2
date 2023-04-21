import { db } from "@/firebase";

export default async function deleteFriendRequest(friendRequestId: string) {
    try {
        db
        .collection('friend_requests')
        .doc(friendRequestId)
        .set({
            isDelete: true
        })
    } catch (error) {
        throw new Error(JSON.stringify(error))
    }
}