import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { ChatType, FileInfo } from "@/types/ChatType";
import { setLocalStorage } from "@/services/CacheService";

// Type for our state
export interface InitialState {
  data: {
    currentChat: ChatType,
    listChat: Array<ChatType>,
  },
  
}

// Initial state
const initialState: InitialState = {
  data: {
    currentChat: {} as ChatType,
    listChat: Array<ChatType>(),
  },

};

// Actual App
export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {

    setGlobalChatState(state, action) {
      switch(action.payload.type) {
        case "setCurrentChat":
            state.data.currentChat = action.payload.data         
            break;
        case "addMessageToCurrentChat":
          let messages = state.data.currentChat.messages
          messages?.push(action.payload.data.newMessage)
          state.data.currentChat = {
            ...state.data.currentChat,
            messages: messages
          }
          setLocalStorage("CurrentChat", state.data.currentChat)
          break;
        case "setListChat":
            state.data.listChat = action.payload.data
            setLocalStorage("ListChat", state.data.listChat)
            break;
        case "pushMessageToListChat":
            state.data.listChat = state.data.listChat.map((chat) => {
              if(chat._id === action.payload.data.chatId) {
                let newData = chat.messages !== undefined ? chat.messages : []
                newData?.push(action.payload.data.newMessage)
                return {
                  ...chat,
                  messages: newData
                }
              } else {
                return chat
              }
            })
            setLocalStorage("ListChat", state.data.listChat)
            break;
        case "setListMessageInRoom":
          state.data.listChat = state.data.listChat.map((chat) => {
            if (chat._id === action.payload.data.chatId) {
              return {
                ...chat,
                messages: action.payload.data.newMessages
              }
            } else {
              return chat
            }
          })
          setLocalStorage("ListChat", state.data.listChat)
          break;
        case "setListImageInRoom":
            let indexListImage = state.data.listChat.findIndex((chat) => chat._id === action.payload.data.chatId)
            state.data.listChat[indexListImage].listImage = action.payload.data.listImage
            setLocalStorage("ListChat", state.data.listChat)
            break;
            // state.data.listChat = state.data.listChat.map((chat) => {
            //   if (chat._id === action.payload.data.chatId) {
            //     return {
            //       ...chat,
            //       listImage: action.payload.data.listImage
            //     }
            //   } else {
            //     return chat
            //   }
            // })
            // setLocalStorage("ListChat", state.data.listChat)
            // break;
        case "addNewImageInRoom":
          let indexImage = state.data.listChat.findIndex((chat) => chat._id === action.payload.data.chatId)
          state.data.listChat[indexImage].listImage = [
            ...state.data.listChat[indexImage].listImage!,
            action.payload.data.newImage
          ]
          setLocalStorage("ListChat", state.data.listChat)
          break;
        case "setListFileInRoom":
              state.data.listChat = state.data.listChat.map((chat) => {
                if (chat._id === action.payload.data.chatId) {
                  return {
                    ...chat,
                    listFile: action.payload.data.listFile
                  }
                } else {
                  return chat
                }
              })
              setLocalStorage("ListChat", state.data.listChat)
              break;
        case "addNewFileInRoom":
          let indexFile = state.data.listChat.findIndex((chat) => chat._id === action.payload.data.chatId)
          state.data.listChat[indexFile].listFile = [
            ...state.data.listChat[indexFile].listFile!,
            action.payload.data.newFile
          ]
          setLocalStorage("ListChat", state.data.listChat)
          break;
        default:
            return
      }
    },
    
  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.chat,
      };
    },
  },
});

export const {
  setGlobalChatState, 
   } = chatSlice.actions;

export const selectChatState = (state: AppState) => state.chat.data;

export default chatSlice.reducer;
