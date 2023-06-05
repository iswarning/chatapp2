import { db } from "@/firebase"

export const setUserOffline = async(userId: string) => {
    try {
        await db.collection("users").doc(userId).update({ isOnline: false })
    } catch(err) {
      console.log(err)
    }
}