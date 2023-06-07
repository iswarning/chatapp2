import firebase from "firebase";
import { ReactionType } from "./ReactionType";

export interface MessageType {
    id: string;
    message: string,
    type: string,
    user: string,
    seen: Array<string>,
    reaction?: Array<ReactionType>,
    timestamp: firebase.firestore.FieldValue,
}