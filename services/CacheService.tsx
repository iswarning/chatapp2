import { db } from "@/firebase";
import { StatusSendType, setAppGlobalState } from "@/redux/appSlice";
import { setGlobalChatState } from "@/redux/chatSlice";
import { setGlobalFriendRequestState } from "@/redux/friendRequestSlice";
import { setGlobalFriendState } from "@/redux/friendSlice";
import { setGlobalVideoCallState } from "@/redux/videoCallSlice";
import { ChatType, FileInfo } from "@/types/ChatType";
import { FriendRequestType } from "@/types/FriendRequestType";
import { FriendType } from "@/types/FriendType";
import { MessageType } from "@/types/MessageType";
import { NotifyResponseType } from "@/types/NotifyResponseType";
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

export function addNewFriendRequest(newFriendRequest: FriendRequestType, dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalFriendRequestState({
        type: "addNewFriendRequest",
        data: newFriendRequest
    }))
}

export function removeFriendRequestGlobal(friendRequest: FriendRequestType, dispatch: Dispatch<AnyAction>) {
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

export function removeFriendGlobal(friendId: string, dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalFriendState({
        type: "removeFriend",
        data: {
            friendId
        }
    }))
}

export function setCurrentChat(args: { chatRoomId: string, index: number }, dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalChatState({
        type: "setCurrentChat",
        data: args
    }))
    setLocalStorage("CurrentChat", args)
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

export function setListImageInRoom(index: number, listImage: FileInfo[], dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalChatState({
        type: "setListImageInRoom",
        data: {
            index,
            listImage
        }
    }))
}

export function addNewImageInRoom(index: number, newImage: FileInfo, dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalChatState({
        type: "addNewImageInRoom",
        data: {
            index,
            newImage
        }
    }))
}

export function addNewFileInRoom(index: number, newFile: FileInfo, dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalChatState({
        type: "addNewFileInRoom",
        data: {
            index,
            newFile
        }
    }))
}

export function setListFileInRoom(index: number, listFile: FileInfo[], dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalChatState({
        type: "setListFileInRoom",
        data: {
            index,
            listFile
        }
    }))
}

export function setListMessageInRoom(index: number, messages: MessageType[] | undefined, dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalChatState({
        type: "setListMessageInRoom",
        data: {
            index,
            newMessages: messages
        }
    }))
}

export function pushMessageToListChat(index: number, newMessage: MessageType, dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalChatState({
        type: "pushMessageToListChat",
        data: {
            index,
            newMessage
        }
    }))
}

export function removeMessageInListChat(indexMessage: number, indexChat: number, dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalChatState({
        type: "removeMessageInListChat",
        data: {
            indexMessage,
            indexChat
        }
    }))
}

export function updateMessageInListChat(chatId: string, newMessage: MessageType, messageId: string, dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalChatState({
        type: "updateMessageInListChat",
        data: {
            chatId,
            newMessage,
            messageId
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

export function setShowGroupInfo(showGroupInfo: boolean,dispatch: Dispatch<AnyAction>) {
    dispatch(setAppGlobalState({
        type: "setShowGroupInfo",
        data: showGroupInfo
    }))
}

export function setStatusSend(status: StatusSendType, dispatch: Dispatch<AnyAction>) {
    dispatch(setAppGlobalState({
        type: "setStatusSend",
        data: status
    }))
}

export function setPrepareSendFiles(prepareFiles: File[], dispatch: Dispatch<AnyAction>) {
    dispatch(setAppGlobalState({
        type: "setPrepareSendFiles",
        data: prepareFiles
    }))
}

export function addPrepareSendFiles(file: File, dispatch: Dispatch<AnyAction>) {
    dispatch(setAppGlobalState({
        type: "addPrepareSendFiles",
        data: file
    }))
}

export function setDataVideoCall(notifyResponse: NotifyResponseType, dispatch: Dispatch<AnyAction>) {
    dispatch(setGlobalVideoCallState({
        type: "setDataVideoCall",
        data: notifyResponse
    }))
}