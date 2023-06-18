import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { ChatType } from "@/types/ChatType";
import { MessageType } from "@/types/MessageType";
import { UserType } from "@/types/UserType";
import { FriendType } from "@/types/FriendType";
import { FriendRequestType } from "@/types/FriendRequestType";

// Type for our state
export interface InitialState {
  data: {
    userInfo:  UserType,
    listFriend: Array<FriendType>,
    listFriendRequest: Array<FriendRequestType>,
    listChat: Array<ChatType>,
    currentChat: ChatType,
    currentMessages: Array<MessageType>,
    userOnline: Array<string>,
    statusSend: Number
  };
}

// Initial state
const initialState: InitialState = {
  data: {
    userInfo:  {} as UserType,
    listFriend: Array<FriendType>(),
    listFriendRequest: Array<FriendRequestType>(),
    listChat: Array<ChatType>(),
    currentChat: {} as ChatType,
    currentMessages: Array<MessageType>(),
    userOnline: Array<string>(),
    statusSend: 0
  },
};

// Actual App
export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // Action to set the initial data
    setUserOnline(state, action) {
      state.data.userOnline = action.payload;
    },

    pushMessageToListChat(state, action) {
      state.data.listChat.forEach((chat, index) => {
        if (chat.id === action.payload.chat.id && chat?.messages) {
          chat.messages = [ ...chat.messages, action.payload.newMessage ]
          state.data.listChat[index] = chat;
        }
      })
    },

    setListChat(state, action) {
      state.data.listChat = action.payload;
    },

    setCurrentChat(state, action) {
      state.data.currentChat = action.payload
    },

    setCurrentMessages(state, action) {
      state.data.currentMessages = action.payload
    },

    addNewMessage(state, action) {
      state.data.currentMessages = [...state.data.currentMessages, action.payload]
    },

    setStatusSend(state, action) {
      state.data.statusSend = action.payload
    }

  },

  // Special reducer for hydrating the state. Special case for next-redux-wrapper
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.app,
      };
    },
  },
});

export const { setUserOnline, setListChat, setCurrentChat, setCurrentMessages, addNewMessage, setStatusSend, pushMessageToListChat } = appSlice.actions;

export const selectAppState = (state: AppState) => state.app.data;

export default appSlice.reducer;
