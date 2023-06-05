// src/context/state.js
import { getMessagingToken } from '@/firebase';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import {ClipLoader} from 'react-spinners'
import Loading from '@/components/Loading';

const AppContext = createContext({});

export function AppWrapper({ children }: any) {

  const { isLoading, error, data } = useQuery({
    queryKey: ['getFCMToken'],
    queryFn: () =>
      getMessagingToken().then(
        (res) => res
      ),
  })

  let fcm_token = data;

  if(isLoading) return <Loading isShow={true} />

  return (
    <AppContext.Provider value={{
      fcm_token
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}