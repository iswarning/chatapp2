import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { UserType } from "@/types/UserType";
import { FriendRequestType } from "@/types/FriendRequestType";
import { FriendType } from "@/types/FriendType";
import { ChatType } from "@/types/ChatType";

// Type for our state
export interface InitialState {
  data: {
    userOnline: Array<string>;
  };
}

// Initial state
const initialState: InitialState = {
  data: {
    userOnline: new Array<string>(),
  },
};

// Actual App
export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // Action to set the initial data
    setInitialState(state, action) {
      state.data = action.payload;
    },
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

export const { setInitialState } = appSlice.actions;

export const selectAppState = (state: AppState) => state.app.data;

export default appSlice.reducer;
