import { setGlobalChatState } from "@/redux/chatSlice";
import { ChatType } from "@/types/ChatType";
import { setLocalStorage } from "@/utils/getLocalStorage";
import { useSelector, useDispatch } from 'react-redux'

const dispatch = useDispatch()

export function setCurrentChat(chat: ChatType) {

}

export function setListChat(listChat: ChatType[]) {

    dispatch(setGlobalChatState({
        type: "setListChat",
        data: listChat
    }))

    setLocalStorage("appStorage.listChat", JSON.stringify(listChat))
}