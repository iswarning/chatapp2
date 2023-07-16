import { ReactionType } from "./ReactionType";
import { UserType } from "./UserType";

export interface MessageType {
    _id?: string
    chatRoomId?: string
    message?: string
    type: string
    senderId: string
    seen?: Array<string>
    reaction?: Array<ReactionType>
    userInfo?: UserType
    file?: string
    images?: string
    createdAt?: string
    updatedAt?: string
}
