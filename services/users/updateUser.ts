import { db } from "@/firebase";
import firebase from "firebase";

export default function UpdateUser(user: any, data: any) {
    try {
        db.collection("users").doc(user?.uid).update({ 
            ...data 
        });
    } catch (error) {
        throw new Error(JSON.stringify(error))
    }
}