import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { ChatType } from "@/types/ChatType";
import { MessageType } from "@/types/MessageType";
import { NotifyResponseType } from "@/types/NotifyResponseType";

export enum StatusCallType {
  INCOMING_CALL,
  CALLING,
  CALLED,
  DISCONNECT_CALL
}

// Type for our state
export interface InitialState {
  data: {
    statusCall: StatusCallType | null,
    showVideoCallScreen: boolean,
    notifyResponse: NotifyResponseType,
    acceptedCall: boolean,
  },
  
}

// Initial state
const initialState: InitialState = {
  data: {
    statusCall: null,
    showVideoCallScreen: false,
    notifyResponse: {} as NotifyResponseType,
    acceptedCall: false,
  },

};

// Actual App
export const videoCallSlice = createSlice({
  name: "videoCall",
  initialState,
  reducers: {

    setGlobalVideoCallState(state, action) {
      switch(action.payload.type) {
        case "setStatusCall":
            state.data.statusCall = action.payload.data
            break;
        case "setShowVideoCallScreen":
            state.data.showVideoCallScreen = action.payload.data
            break;
        case "setDataVideoCall":
            state.data.notifyResponse = action.payload.data
            break;
        case "setAcceptedCall":
            state.data.acceptedCall = action.payload.data
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
        ...action.payload.videoCall,
      };
    },
  },
});

export const {
  setGlobalVideoCallState, 
   } = videoCallSlice.actions;

export const selectVideoCallState = (state: AppState) => state.videoCall.data;

export default videoCallSlice.reducer;
