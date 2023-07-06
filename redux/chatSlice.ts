import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { ChatType } from "@/types/ChatType";

// Type for our state
export interface InitialState {
  data: {
    currentChat: ChatType,
    listChat: Array<ChatType>
  },
  
}

// Initial state
const initialState: InitialState = {
  data: {
    currentChat: {} as ChatType,
    listChat: Array<ChatType>()
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
                            action.payload.newMessage
                        ]
                    }
                ]
            } else {
                return
            }
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
