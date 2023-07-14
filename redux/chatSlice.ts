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
            let chatExist = state.data.listChat.find((chat) => chat.id === action.payload.data.chatId);
            if (chatExist?.messages) {
                state.data.listChat = [
                    ...state.data.listChat,
                    {
                        ...chatExist,
                        messages: [
                            ...chatExist.messages,
                            action.payload.data.newMessage
                        ]
                    }
                ]
            } else {
                return
            }
            setLocalStorage("ListChat", state.data.listChat)
            break;
        case "setListMessageInRoom":
          state.data.listChat = state.data.listChat.map((chat) => {
            if (chat.id === action.payload.data.chatId) {
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
              if (chat.id === action.payload.data.chatId) {
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
        case "setListFileInRoom":
              state.data.listChat = state.data.listChat.map((chat) => {
                if (chat.id === action.payload.data.chatId) {
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
