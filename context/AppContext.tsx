// src/context/state.js
import { auth, getMessagingToken } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Loading from "@/components/Loading";
import { useAuthState } from "react-firebase-hooks/auth";
import getInitialState from "@/utils/getInitialState";

const AppContext = createContext({});

export function AppWrapper({ children }: any) {
  // const [user] = useAuthState(auth);
  // const [isLoadFirst, setIsLoadFirst] = useState(false);
  // const [appData, setAppData] = useState();

  // useEffect(() => {
  //   if (appData === undefined) {
  //     setIsLoadFirst(true);
  //     return;
  //   }

  //   if (isLoadFirst) {
  //     getInitialState((res) => setAppData(res)).catch((err) =>
  //       console.log(err)
  //     );
  //     setIsLoadFirst(false);
  //   }
  // }, [appData]);

  // if (isLoading) return <Loading isShow={true} />;

  return (
    <AppContext.Provider
      value={
        {
          // appData,
        }
      }
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
