import { MapMessageData, MessageType } from "./MessageType";
import firebase from "firebase";
import { UserType } from "./UserType";

export interface ChatType {
    id: string
    users: Array<string>
    photoURL: string
    isGroup: boolean
    name: string
    admin: string
    messages?: Array<MessageType>
    recipientInfo?: UserType
    listRecipientInfo?: UserType[]
    lastMessage?: MessageType
    listImage?: FileInfo[]
    listFile?: FileInfo[]
}

export interface FileInfo {
    key: string
    name: string
    size: number
    url: string
    timeCreated: string
}

export const MapChatData = (chat: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): ChatType => {
    let chatData: ChatType = {} as ChatType;
    chatData.id = chat.id;
    chatData.users = chat?.data()?.users;
    chatData.photoURL = chat?.data()?.photoURL;
    chatData.isGroup = chat?.data()?.isGroup;
    chatData.name = chat?.data()?.name;
    chatData.admin = chat?.data()?.admin;
    return chatData;
}