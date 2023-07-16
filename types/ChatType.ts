import { MessageType } from "./MessageType";
import { UserType } from "./UserType";

export interface ChatType {
    _id?: string
    members: string[]
    photoURL?: string
    isGroup: boolean
    name?: string
    admin?: string
    messages?: Array<MessageType>
    recipientInfo?: UserType
    listRecipientInfo?: UserType[]
    lastMessage?: MessageType
    listImage?: FileInfo[]
    listFile?: FileInfo[]
    createdAt?: string
    updatedAt?: string
}

export interface FileInfo {
    key: string
    name: string
    size: number
    url: string
    timeCreated: string
}