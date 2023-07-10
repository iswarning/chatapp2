import { db } from "@/firebase";
import { StatusSendType, setAppGlobalState } from "@/redux/appSlice";
import { setGlobalChatState } from "@/redux/chatSlice";
import { setGlobalFriendRequestState } from "@/redux/friendRequestSlice";
import { setGlobalFriendState } from "@/redux/friendSlice";
import { setGlobalMessageState } from "@/redux/messageSlice";
import { ChatType, FileInfo } from "@/types/ChatType";
import { FriendRequestType } from "@/types/FriendRequestType";
import { FriendType } from "@/types/FriendType";
import { MapMessageData, MessageType } from "@/types/MessageType";
import { UserType } from "@/types/UserType";
import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import CryptoJS from 'crypto-js';

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

export function setListFriend(listFriend: FriendType[], dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalFriendState({
        type: "setListFriend",
        data: listFriend
    }))
    setLocalStorage("ListFriend", listFriend)
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
    setLocalStorage("ListChat", listChat)
}

export function setUserInfo(userInfo: UserType, dispatch: Dispatch<AnyAction>) {
    dispatch(setAppGlobalState({
        type: "setUserInfo",
        data: userInfo
    }))
    setLocalStorage("UserInfo", userInfo)
}

export function setCurrentMessages(chatId: string,messages: MessageType[], dispatch: Dispatch<AnyAction>) {
    getLastMessage(chatId).then((lastMsg) => {
        if(messages[messages.length - 1].id === lastMsg.id) {
            dispatch(setGlobalMessageState({
                type: "setCurrentMessages",
                data: messages
            }))
            setLocalStorage("CurrentMessages", messages)
        } else {
            db.collection("chats").doc(chatId).collection("messages").get().then((snap) => {
                let newMessages = snap.docs.map((m) => MapMessageData(m))
                dispatch(setGlobalMessageState({
                    type: "setCurrentMessages",
                    data: newMessages
                }))
                setLocalStorage("CurrentMessages", newMessages)
            })
        }
    })
}

export function addNewMessage(newMessage: MessageType, dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalMessageState({
        type: "addNewMessage",
        data: newMessage
    }))
}

export function setListImageInRoom(chatId: string, listImage: FileInfo[], dispatch: Dispatch<AnyAction>) {
    dispatch(setAppGlobalState({
        type: "setListImageInRoom",
        data: {
            chatId,
            listImage
        }
    }))
}

async function getLastMessage(chatId: string) {
    return MapMessageData(
        (await db
            .collection("chats")
            .doc(chatId)
            .collection("messages")
            .orderBy("timestamp")
            .limitToLast(1)
            .get()
        ).docs?.[0])
}

export function pushMessageToListChat(chatId: string, newMessage: MessageType, dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalChatState({
        type: "pushMessageToListChat",
        data: {
            chatId,
            newMessage
        }
    }))
    // setLocalStorage("ListChat", listChat)
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

