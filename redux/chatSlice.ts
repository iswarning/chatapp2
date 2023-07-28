import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { ChatType, FileInfo } from "@/types/ChatType";
import { setLocalStorage } from "@/services/CacheService";

// Type for our state
export interface InitialState {
  data: {
    currentChat: {
      chatRoomId: string,
      index: number
    },
    listChat: Array<ChatType>,
  },
  
}

// Initial state
const initialState: InitialState = {
  data: {
    currentChat: {
      chatRoomId: "",
      index: -1
    },
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

        case "setCurrentChat": {
          state.data.currentChat = action.payload.data         
          break;
        }
          
        case "setListChat": {
          state.data.listChat = action.payload.data
          setLocalStorage("ListChat", state.data.listChat)
          break;
        }
          
        case "pushMessageToListChat": {
          let index = state.data.listChat.findIndex(chat => chat._id === action.payload.data.chatId)
          state?.data?.listChat?.[index]?.messages?.push(action.payload.data.newMessage)
          setLocalStorage("ListChat", state.data.listChat)
          break;
        }

        case "updateMessageInListChat": {
          state.data.listChat = state.data.listChat.map((chat) => {
            if (chat._id === action.payload.data.chatId) {
              return {
                ...chat,
                messages: chat.messages?.map((msg) => {
                  if (msg._id === action.payload.data.messageId) {
                    return {
                      ...action.payload.data.newMessage
                    }
                  } else {
                    return msg
                  }
                })
              }
            } else {
              return chat
            }
          })
          setLocalStorage("ListChat", state.data.listChat)
          break;
        }

        case "removeMessageInListChat": {
          state.data.listChat = state.data.listChat.map((chat) => {
            if (chat._id === action.payload.data.chatId) {
              return {
                ...chat,
                messages: chat?.messages?.splice(
                  chat?.messages?.findIndex((msg) => msg._id === action.payload.data.messageId)!
                  , 1)
              }
            } else {
              return chat
            }
          })
          setLocalStorage("ListChat", state.data.listChat)
          break;
        }

        case "setListMessageInRoom": {
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
          break
        }

        case "setListImageInRoom": {
          let indexListImage = state.data.listChat.findIndex((chat) => chat._id === action.payload.data.chatId)
          let listChat = state.data.listChat
          listChat[indexListImage].listImage = action.payload.data.listImage
          state.data.listChat = listChat
          setLocalStorage("ListChat", listChat)
          break;
        }
            
        case "addNewImageInRoom": {
          state.data.listChat = state.data.listChat.map((chat) => {
            let newListImage = chat.listImage
            newListImage?.push(action.payload.data.newImage)
            if (chat._id === action.payload.data.chatId) {
              return {
                ...chat,
                listFile: newListImage
              }
            } else {
              return chat
            }
          })
          setLocalStorage("ListChat", state.data.listChat)
          break;
        }
        
        case "setListFileInRoom": {
          let indexListImage = state.data.listChat.findIndex((chat) => chat._id === action.payload.data.chatId)
          let listChat = state.data.listChat
          listChat[indexListImage].listFile = action.payload.data.listFile
          state.data.listChat = listChat
          setLocalStorage("ListChat", listChat)
          break;
        }
          
        case "addNewFileInRoom": {
          state.data.listChat = state.data.listChat.map((chat) => {
            let newListFile = chat.listFile
            newListFile?.push(action.payload.data.newFile)
            if (chat._id === action.payload.data.chatId) {
              return {
                ...chat,
                listFile: newListFile
              }
            } else {
              return chat
            }
          })
          setLocalStorage("ListChat", state.data.listChat)
          break;
        }

        default:
            return
      }
    },

    setGlobalMessageState(state, action) {
      switch(action.payload.type) {

        case "pushMessageToListChat": {
          state.data.listChat[action.payload.data.index].messages?.push(action.payload.data.newMessage)
          break
        }
        case "reactionToMessage": {
          let reactionExist = JSON.parse(
            state.data.listChat[action.payload.data.indexChat].messages?.[action.payload.data.indexMessage].reaction!
          ) ?? null
          if (reactionExist) {
            if (reactionExist.emoji === action.payload.data.reaction.emoji) {
              JSON.stringify(
                JSON.parse(
                  state.data.listChat[action.payload.data.indexChat].messages?.[action.payload.data.indexMessage].reaction!
                ).find((react: any) => react.emoji === action.payload.data.reaction.emoji)
              )
            } else {
              JSON.stringify(
                JSON.parse(
                  state.data.listChat[action.payload.data.indexChat].messages?.[action.payload.data.indexMessage].reaction!
                ).push(action.payload.data.reaction)
              )
            }
          }
          break
        }

      }
    }
    
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
