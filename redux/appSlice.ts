import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { ChatType } from "@/types/ChatType";
import { MessageType } from "@/types/MessageType";

// Type for our state
export interface InitialState {
  data: {
    userOnline: Array<string>,
    chatData: ChatType,
    messageData: Array<MessageType>,
  };
}

// Initial state
const initialState: InitialState = {
  data: {
    userOnline: new Array<string>(),
    chatData: {} as ChatType,
    messageData: new Array<MessageType>(),
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
    setChatData(state, action) {
      state.data.chatData = action.payload
    },
    setMessageData(state, action) {
      state.data.messageData = action.payload
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

export const { setUserOnline, setChatData, setMessageData } = appSlice.actions;

export const selectAppState = (state: AppState) => state.app.data;

export default appSlice.reducer;
