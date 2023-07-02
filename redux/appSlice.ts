import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { ChatType } from "@/types/ChatType";
import { MessageType } from "@/types/MessageType";
import { UserType } from "@/types/UserType";
import { FriendType } from "@/types/FriendType";
import { FriendRequestType } from "@/types/FriendRequestType";
import { Socket, io } from "socket.io-client";

export enum SidebarType {
  CHAT,
  GROUPS,
  CONTACTS,
  PROFILE,
}

export enum StatusCallType {
  INCOMING_CALL,
  CALLING,
  CALLED,
  DISCONNECT_CALL
}
// Type for our state
export interface InitialState {
  data: {
    userInfo:  UserType,
    currentChat: ChatType,
    currentMessages: Array<MessageType>,
    userOnline: Array<string>,
    currentSidebar: SidebarType,
    statusCall: StatusCallType,
    showVideoCallScreen: boolean,
    dataVideoCall: any,
    socket: Socket,
    acceptedCall: boolean,
    darkMode: boolean,
    stream: MediaStream | null
    AppState: {
      showDropdownActionUser: boolean,
      UploadProgressMultipleFile: any
    }
  },
  
}

// Initial state
const initialState: InitialState = {
  data: {
    userInfo:  {} as UserType,
    currentChat: {} as ChatType,
    currentMessages: Array<MessageType>(),
    userOnline: Array<string>(),
    currentSidebar: SidebarType.CHAT,
    statusCall: StatusCallType.CALLING,
    showVideoCallScreen: false,
    dataVideoCall: {},
    socket: io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!),
    acceptedCall: false,
    darkMode: false,
    stream: null,
    AppState: {
      showDropdownActionUser: false,
      UploadProgressMultipleFile: Array<any>(),
    }
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

    setSidebar(state, action) {
      state.data.currentSidebar = action.payload
    },

    setStatusCall(state, action) {
      state.data.statusCall = action.payload
    },

    setShowVideoCallScreen(state, action) {
      state.data.showVideoCallScreen = action.payload
    },
    
    setDataVideoCall(state, action) {
      state.data.dataVideoCall = action.payload
    },

    setAcceptedCall(state, action) {
      state.data.acceptedCall = action.payload
    },

    setDarkMode(state, action) {
      state.data.darkMode = action.payload
    },

    setStream(state, action) {
      state.data.stream = action.payload
    },

    setAppState(state, action) {
      switch(action.payload.type) {
        case "App/DropdownActionUser":
          state.data.AppState.showDropdownActionUser = action.payload.data
          break;
        case "App/UploadProgressMultipleFile":
          state.data.AppState.UploadProgressMultipleFile = action.payload.data
      }
    },

    setProgressState(state, action) {
      state.data.AppState.UploadProgressMultipleFile = action.payload
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
  setSidebar,
  setStatusCall,
  setShowVideoCallScreen,
  setDataVideoCall,
  setAcceptedCall,
  setDarkMode,
  setStream,
  setAppState,
  setProgressState
   } = appSlice.actions;

export const selectAppState = (state: AppState) => state.app.data;

export default appSlice.reducer;
