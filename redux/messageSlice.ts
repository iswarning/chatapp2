import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { ChatType } from "@/types/ChatType";
import { MessageType } from "@/types/MessageType";

// Type for our state
export interface InitialState {
  data: {
    currentMessages: Array<MessageType>
  },
  
}

// Initial state
const initialState: InitialState = {
  data: {
    currentMessages: Array<MessageType>(),
  },

};

// Actual App
export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {

    setGlobalMessageState(state, action) {
      switch(action.payload.type) {
        case "setCurrentMessages":
            state.data.currentMessages = action.payload.data
            break;
        case "addNewMessage":
            state.data.currentMessages = [
                ...state.data.currentMessages,
                action.payload.data
            ]
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
  setGlobalMessageState, 
   } = messageSlice.actions;

export const selectMessageState = (state: AppState) => state.message.data;

export default messageSlice.reducer;
