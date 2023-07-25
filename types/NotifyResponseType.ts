import { ChatType } from "./ChatType"
import { FriendRequestType } from "./FriendRequestType"
import { FriendType } from "./FriendType"
import { MessageType } from "./MessageType"

export interface NotifyResponseType {
    message?: string
    type: string
    senderId: string
    recipientId?: string
    dataVideoCall?: DataVideoCall
    dataNotify?: DataNotify
}

export interface DataVideoCall {
    fullName?: string
    photoURL?: string
    chatRoomId?: string
    isGroup?: boolean
    accessToken?: string
}

export interface DataNotify {
    message?: MessageType
    chatRoom?: ChatType
    friend?: FriendType
    friendRequest?: FriendRequestType
}