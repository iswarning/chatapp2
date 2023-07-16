import { db } from "@/firebase";
import { StatusSendType, setAppGlobalState } from "@/redux/appSlice";
import { setGlobalChatState } from "@/redux/chatSlice";
import { setGlobalFriendRequestState } from "@/redux/friendRequestSlice";
import { setGlobalFriendState } from "@/redux/friendSlice";
import { ChatType, FileInfo } from "@/types/ChatType";
import { FriendRequestType } from "@/types/FriendRequestType";
import { FriendType } from "@/types/FriendType";
import { MessageType } from "@/types/MessageType";
import { UserType } from "@/types/UserType";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import CryptoJS from 'crypto-js';
import { getAllMessagesByChatRoomId, getLastMessage } from "./MessageService";

const SECRET_KEY = process.env.NEXT_PUBLIC_FIREBASE_SERVER_KEY!

export function setLocalStorage(name: string, data: any) {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    localStorage.setItem(name, encrypted);
}

export function getLocalStorage(name: string) {
    if(localStorage.getItem(name) === null || localStorage.getItem(name) === undefined) return null
    const encrypted = localStorage.getItem(name);
    const decrypted = CryptoJS.AES.decrypt(encrypted!, SECRET_KEY).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
}

export function setListFriendRequest(listFriendRequest: FriendRequestType[], dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalFriendRequestState({
        type: "setListFriendRequest",
        data: listFriendRequest
    }))
    setLocalStorage("ListFriendRequest", listFriendRequest)
}

export function addNewFriendRequest(newFriendRequest: FriendRequestType, dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalFriendRequestState({
        type: "addNewFriendRequest",
        data: newFriendRequest
    }))
}

export function removeFriendRequest(friendRequest: FriendRequestType, dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalFriendRequestState({
        type: "removeFriendRequest",
        data: friendRequest._id
    }))
}

export function setListFriend(listFriend: FriendType[], dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalFriendState({
        type: "setListFriend",
        data: listFriend
    }))
    setLocalStorage("ListFriend", listFriend)
}

export function addNewFriend(newFriend: FriendType, dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalFriendState({
        type: "addNewFriend",
        data: newFriend
    }))
}

export function removeFriend(friend: FriendType, dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalFriendState({
        type: "removeFriend",
        data: friend._id
    }))
}

export function setCurrentChat(chat: ChatType, dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalChatState({
        type: "setCurrentChat",
        data: chat
    }))
    setLocalStorage("CurrentChat", chat)
}

export function setListChat(listChat: ChatType[], dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalChatState({
        type: "setListChat",
        data: listChat
    }))
}

export function setUserInfo(userInfo: UserType, dispatch: Dispatch<AnyAction>) {
    dispatch(setAppGlobalState({
        type: "setUserInfo",
        data: userInfo
    }))
    setLocalStorage("UserInfo", userInfo)
}

export function setListImageInRoom(chatId: string, listImage: FileInfo[], dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalChatState({
        type: "setListImageInRoom",
        data: {
            chatId,
            listImage
        }
    }))
}

export function setListFileInRoom(chatId: string, listFile: FileInfo[], dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalChatState({
        type: "setListFileInRoom",
        data: {
            chatId,
            listFile
        }
    }))
}

export function setListMessageInRoom(chatId: string, messages: MessageType[] | undefined, dispatch: Dispatch<AnyAction>) {
    getLastMessage(chatId).then((lastMsg: MessageType) => {
        if(messages?.length! > 0) {
            if(messages?.[messages.length - 1]._id === lastMsg._id) {
                dispatch(setGlobalChatState({
                    type: "setListMessageInRoom",
                    data: {
                        chatId,
                        newMessages: messages
                    }
                }))
            } else {
                getAllMessagesByChatRoomId(chatId).then((newMessages) => {
                    dispatch(setGlobalChatState({
                        type: "setListMessageInRoom",
                        data: {
                            chatId,
                            newMessages
                        }
                    }))
                })
            }
        }
    })
}

export function pushMessageToListChat(chatId: string, newMessage: MessageType, dispatch: Dispatch<AnyAction>) {
    console.log(11111)
    dispatch(setGlobalChatState({
        type: "pushMessageToListChat",
        data: {
            chatId,
            newMessage
        }
    }))
}

export function setFileUploading(key: string, value: string, dispatch: Dispatch<AnyAction>) {
    dispatch(setAppGlobalState({
        type: "setFileUploading",
        data: {
          key,
          value
        }
    }))
}

export function setFileUploadDone(key: string, dispatch: Dispatch<AnyAction>) {
    dispatch(setAppGlobalState({
        type: "setFileUploadDone",
        data: key
    }))
}

export function setProgress(progress: number, dispatch: Dispatch<AnyAction>) {
    dispatch(setAppGlobalState({
        type: "setProgress",
        data: progress
    }))
}

export function setShowImageFullScreen(urlImage: string, isShow: boolean, dispatch: Dispatch<AnyAction>) {
    dispatch(setAppGlobalState({
        type: "setShowImageFullScreen",
        data: {
            isShow,
            urlImage
        }
    }))
}

export function setStatusSend(status: StatusSendType, dispatch: Dispatch<AnyAction>) {
    dispatch(setAppGlobalState({
        type: "setStatusSend",
        data: status
    }))
}

