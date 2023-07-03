import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import { appSlice } from "./appSlice";
import { chatSlice } from "./chatSlice";
import { messageSlice } from "./messageSlice";
import { videoCallSlice } from "./videoCallSlice";

const makeStore = () =>
  configureStore({
    reducer: {
      [appSlice.name]: appSlice.reducer,
      [chatSlice.name]: chatSlice.reducer,
      [messageSlice.name]: messageSlice.reducer,
      [videoCallSlice.name]: videoCallSlice.reducer,
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
