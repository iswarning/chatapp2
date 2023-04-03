import { db } from "@/firebase"

export const getUserById = (id: string) => {
    return Promise.resolve(db
        .collection('users')
        .doc(id)
        .get())        
}