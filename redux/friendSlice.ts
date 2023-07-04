import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { FriendType } from "@/types/FriendType";

// Type for our state
export interface InitialState {
  data: {
    listFriend: Array<FriendType>
  },
  
}

// Initial state
const initialState: InitialState = {
  data: {
    listFriend: Array<FriendType>(),
  },

};

// Actual App
export const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {

    setGlobalFriendState(state, action) {
      switch(action.payload.type) {
        case "setListFriend":
            state.data.listFriend = action.payload.data
            break;
        case "addNewFriend":
            state.data.listFriend = [
                ...state.data.listFriend,
                action.payload.data
            ]
            break;
        case "removeFriend":
            let index = state.data.listFriend.findIndex((f) => f.id === action.payload.data)
            state.data.listFriend = state.data.listFriend.splice(index, 1)
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
        ...action.payload.friend,
      };
    },
  },
});

export const {
  setGlobalFriendState, 
   } = friendSlice.actions;

export const selectFriendState = (state: AppState) => state.friend.data;

export default friendSlice.reducer;
