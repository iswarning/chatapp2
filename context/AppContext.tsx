// src/context/state.js
import { auth, getMessagingToken } from '@/firebase';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import {ClipLoader} from 'react-spinners'
import Loading from '@/components/Loading';
import { useAuthState } from 'react-firebase-hooks/auth';
import getInitialState from '@/utils/getInitialState';

const AppContext = createContext({});

export function AppWrapper({ children }: any) {

  const [user] = useAuthState(auth);

  // const { isLoading, error, data } = useQuery({
  //   queryKey: ['getInitialState'],
  //   queryFn: () =>
  //     getInitialState(user).then(
  //       (res) => res
  //     ),
  // })

  // if(isLoading) return <Loading isShow={true} />

  return (
    <AppContext.Provider value={{
      
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}