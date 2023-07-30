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
          state?.data?.listChat?.[action.payload.data.index]?.messages?.push(action.payload.data.newMessage)
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
          state.data.listChat[action.payload.data.indexChat].messages?.splice(action.payload.data.indexMessage, 1)
          setLocalStorage("ListChat", state.data.listChat)
          break;
        }

        case "setListMessageInRoom": {
          state.data.listChat[action.payload.data.index].messages?.concat(action.payload.data.newMessages)
          setLocalStorage("ListChat", state.data.listChat)
          break
        }

        case "setListImageInRoom": {
          state.data.listChat[action.payload.data.index].listImage = action.payload.data.listImage
          setLocalStorage("ListChat", state.data.listChat)
          break;
        }
            
        case "addNewImageInRoom": {
          state.data.listChat[action.payload.data.index].listImage?.push(action.payload.data.newImage)
          setLocalStorage("ListChat", state.data.listChat)
          break;
        }
        
        case "setListFileInRoom": {
          state.data.listChat[action.payload.data.index].listFile = action.payload.data.listFile
          setLocalStorage("ListChat", state.data.listChat)
          break;
        }
          
        case "addNewFileInRoom": {
          state.data.listChat[action.payload.data.index].listFile?.push(action.payload.data.newFile)
          setLocalStorage("ListChat", state.data.listChat)
          break;
        }

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
