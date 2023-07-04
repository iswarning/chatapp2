import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { UserType } from "@/types/UserType";
import { Socket, io } from "socket.io-client";

export enum SidebarType {
  CHAT,
  GROUPS,
  CONTACTS,
  PROFILE,
}

export enum StatusSendType {
  SENDING,
  SENT,
  ERROR
}


// Type for our state
export interface InitialState {
  data: {
    userInfo:  UserType,
    userOnline: Array<string>,
    currentSidebar: SidebarType,
    socket: Socket,
    darkMode: boolean,
    UploadProgressMultipleFile: any,
    statusSend?: StatusSendType
  },
  
}

// Initial state
const initialState: InitialState = {
  data: {
    userInfo:  {} as UserType,
    userOnline: Array<string>(),
    currentSidebar: SidebarType.CHAT,
    socket: io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!),
    darkMode: false,
    UploadProgressMultipleFile: Array<any>(),
    statusSend: undefined
  },

};

// Actual App
export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {

    setAppGlobalState(state, action) {
      switch(action.payload.type) {
        case "setProgress":
          state.data.UploadProgressMultipleFile = [
            ...state.data.UploadProgressMultipleFile,
            action.payload.data
          ]
          break;
        case "setDarkMode":
          state.data.darkMode = action.payload.data;
          break;
        case "setCurrentSidebar":
          state.data.currentSidebar = action.payload.data;
          break;
        case "setUserInfo":
          state.data.userInfo = action.payload.data;
          break;
        case "setUserOnline":
          state.data.userOnline = action.payload.data;
          break;
        case "setStatusSend":
          state.data.statusSend = action.payload.data;
          break
        default:
          return
      }
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

export const { setAppGlobalState
   } = appSlice.actions;

export const selectAppState = (state: AppState) => state.app.data;

export default appSlice.reducer;
