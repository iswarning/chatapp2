import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { ChatType } from "@/types/ChatType";
import { MessageType } from "@/types/MessageType";
import { UserType } from "@/types/UserType";
import { FriendType } from "@/types/FriendType";
import { FriendRequestType } from "@/types/FriendRequestType";

export enum SidebarType {
  CHAT,
  GROUPS,
  CONTACTS,
  PROFILE,
}
// Type for our state
export interface InitialState {
  data: {
    userInfo:  UserType,
    currentChat: ChatType,
    currentMessages: Array<MessageType>,
    userOnline: Array<string>,
    statusSend: number,
    currentSidebar: SidebarType
  };
}

// Initial state
const initialState: InitialState = {
  data: {
    userInfo:  {} as UserType,
    currentChat: {} as ChatType,
    currentMessages: Array<MessageType>(),
    userOnline: Array<string>(),
    statusSend: 0,
    currentSidebar: SidebarType.CHAT
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

    setUserInfo(state, action) {
      state.data.userInfo = action.payload;
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
    },

    setSidebar(state, action) {
      state.data.currentSidebar = action.payload
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

export const { setUserOnline,
  setUserInfo, 
  setCurrentChat, 
  setCurrentMessages, 
  addNewMessage, 
  setStatusSend, 
  setSidebar,
   } = appSlice.actions;

export const selectAppState = (state: AppState) => state.app.data;

export default appSlice.reducer;
