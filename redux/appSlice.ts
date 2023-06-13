import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { ChatType } from "@/types/ChatType";

// Type for our state
export interface InitialState {
  data: {
    userOnline: Array<string>;
    chatData: ChatType
  };
}

// Initial state
const initialState: InitialState = {
  data: {
    userOnline: new Array<string>(),
    chatData: {} as ChatType
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

export const { setUserOnline, setChatData } = appSlice.actions;

export const selectAppState = (state: AppState) => state.app.data;

export default appSlice.reducer;
