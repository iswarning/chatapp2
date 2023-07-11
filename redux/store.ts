import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { appSlice } from "./appSlice";
import { chatSlice } from "./chatSlice";
import { videoCallSlice } from "./videoCallSlice";
import { friendSlice } from "./friendSlice";
import { friendRequestSlice } from "./friendRequestSlice";

const makeStore = () =>
  configureStore({
    reducer: {
      [appSlice.name]: appSlice.reducer,
      [chatSlice.name]: chatSlice.reducer,
      [videoCallSlice.name]: videoCallSlice.reducer,
      [friendSlice.name]: friendSlice.reducer,
      [friendRequestSlice.name]: friendRequestSlice.reducer,
    },
    devTools: true,
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const wrapper = createWrapper<AppStore>(makeStore);
