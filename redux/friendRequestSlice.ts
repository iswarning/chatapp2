import { createSlice } from "@reduxjs/toolkit";
import { AppState } from "./store";
import { HYDRATE } from "next-redux-wrapper";
import { FriendRequestType } from '../types/FriendRequestType'
// Type for our state
export interface InitialState {
  data: {
    listFriendRequest: Array<FriendRequestType>
  },
  
}

// Initial state
const initialState: InitialState = {
  data: {
    listFriendRequest: Array<FriendRequestType>(),
  },

};

// Actual App
export const friendRequestSlice = createSlice({
  name: "friendRequest",
  initialState,
  reducers: {

    setGlobalFriendRequestState(state, action) {
      switch(action.payload.type) {
        case "setListFriendRequest":
            state.data.listFriendRequest = action.payload.data
            break;
        case "addNewFriendRequest":
            state.data.listFriendRequest = [
                ...state.data.listFriendRequest,
                action.payload.data
            ]
            break;
        case "removeFriendRequest":
          let index = state.data.listFriendRequest.findIndex((fR) => fR.id === action.payload.data)
          state.data.listFriendRequest = state.data.listFriendRequest.splice(index, 1)
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
        ...action.payload.friendRequest,
      };
    },
  },
});

export const {
    setGlobalFriendRequestState, 
   } = friendRequestSlice.actions;

export const selectFriendRequestState = (state: AppState) => state.friendRequest.data;

export default friendRequestSlice.reducer;
