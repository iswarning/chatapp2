import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { ChatType } from "@/types/ChatType";
import { MessageType } from "@/types/MessageType";

// Type for our state
export interface InitialState {
  data: {
    statusCall: string,
    showVideoCallScreen: boolean,
    dataVideoCall: any,
    acceptedCall: boolean,
  },
  
}

// Initial state
const initialState: InitialState = {
  data: {
    statusCall: "",
    showVideoCallScreen: false,
    dataVideoCall: {},
    acceptedCall: false,
  },

};

// Actual App
export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {

    setGlobalChatState(state, action) {
      switch(action.payload.type) {
        case "setStatusCall":
            state.data.statusCall = action.payload.data
            break;
        case "setShowVideoCallScreen":
            state.data.showVideoCallScreen = action.payload.data
            break;
        case "setDataVideoCall":
            state.data.dataVideoCall = action.payload.data
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
        ...action.payload.message,
      };
    },
  },
});

export const {
  setGlobalChatState, 
   } = messageSlice.actions;

export const selectChatState = (state: AppState) => state.message.data;

export default messageSlice.reducer;
