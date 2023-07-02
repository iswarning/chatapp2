import firebase from "firebase";
import { ReactionType } from "./ReactionType";
import { ImageInMessageType } from "./ImageInMessageType";
import { UserType } from "./UserType";
import { ImageAttachType } from "./ImageAttachType";
import { FileInMessageType } from "./FileInMessageType";

export interface MessageType {
    id: string
    message: string
    type: string
    user: string
    seen: Array<string>
    reaction?: Array<ReactionType>
    imageInMessage?: Array<ImageInMessageType>
    imageAttach?: Array<ImageAttachType>
    fileAttach?: FileInMessageType,
    key?: string,
    size?: string,
    name?: string,
    timestamp: any
    userInfo?: UserType
}

export const MapMessageData = (message: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): MessageType => {
    let messageData: MessageType = {} as MessageType;
    messageData.id = message?.id;
    messageData.message = message?.data()?.message;
    messageData.type = message?.data()?.type;
    messageData.user = message?.data()?.user;
    messageData.seen = message?.data()?.seen;
    messageData.reaction = message?.data()?.reaction;
    messageData.timestamp = message?.data()?.timestamp;
    messageData.key = message?.data()?.key;
    messageData.size = message?.data()?.size;
    messageData.name = message?.data()?.name;
    return messageData;
}