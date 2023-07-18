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
            state.data.listChat = state.data.listChat.map((chat) => {
              if (chat._id === action.payload.data.chatId) {
                return {
                  ...chat,
                  listImage: action.payload.data.listImage
                }
              } else {
                return chat
              }
            })
            setLocalStorage("ListChat", state.data.listChat)
            break;
        case "addNewImageInRoom":
          let index = state.data.listChat.findIndex((chat) => chat._id === action.payload.data.chatId)
          state.data.listChat[index].listImage = [
            ...state.data.listChat[index].listImage!,
            action.payload.data.newImage
          ]
          // state.data.listChat = state.data.listChat.map((chat) => {
          //   if (chat._id === action.payload.data.chatId) {
          //     let listImage = chat.listImage
          //     listImage?.push(action.payload.data.newImage)
          //     return {
          //       ...chat,
          //       listImage: listImage
          //     }
          //   } else {
          //     return chat
          //   }
          // })
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
