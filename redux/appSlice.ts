import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { UserType } from "@/types/UserType";

export enum SidebarType {
  CHAT,
  GROUPS,
  CONTACTS,
  FRIEND_REQUEST,
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
    // socket: Socket,
    darkMode: boolean,
    UploadProgressMultipleFile: any,
    statusSend?: StatusSendType,
    fileUploading: any,
    fileUploadDone: any,
    showImageFullScreenData: any,
    showGroupInfo: boolean,
    prepareSendFiles: Array<File>,
    downloadMultipleFile: {
      isShow: boolean,
      keys: string[]
    }
  },
  
}

// Initial state
const initialState: InitialState = {
  data: {
    userInfo:  {} as UserType,
    userOnline: Array<string>(),
    currentSidebar: SidebarType.CHAT,
    // socket: io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!),
    darkMode: false,
    UploadProgressMultipleFile: [],
    statusSend: undefined,
    fileUploading: [],
    fileUploadDone: [],
    showImageFullScreenData: {
      isShow: false,
      urlImage: ""
    },
    showGroupInfo: false,
    prepareSendFiles: [],
    downloadMultipleFile: {
      isShow: false,
      keys: []
    }
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
          state.data.UploadProgressMultipleFile = action.payload.data
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
        case "setDownloadMultipleFile":
          state.data.downloadMultipleFile = action.payload.data;
          break
        case "setFileUploading":
          state.data.fileUploading = action.payload.data
          break
        case "setFileUploadDone":
          state.data.fileUploadDone = [
            ...state.data.fileUploadDone,
            action.payload.data
          ]
          break
        case "setShowImageFullScreen":
            state.data.showImageFullScreenData = action.payload.data
            break
        case "setShowGroupInfo":
            state.data.showGroupInfo = action.payload.data
          break
        case "setPrepareSendFiles":
            state.data.prepareSendFiles = action.payload.data
          break
        case "addPrepareSendFiles":
            state.data.prepareSendFiles = [
              ...state.data.prepareSendFiles,
              action.payload.data
            ]
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
