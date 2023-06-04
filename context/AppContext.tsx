// src/context/state.js
import { getMessagingToken } from '@/firebase';
import { useQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const AppContext = createContext(null);

export function AppWrapper({ children }: any) {

  const { isLoading, error, data } = useQuery({
    queryKey: ['getFCMToken'],
    queryFn: () =>
      getMessagingToken().then(
        (res) => res
      ),
  })

  const initialState: any = {
    fcm_token: data
  } 

  if(isLoading) return <CircularProgress />

  return (
    <AppContext.Provider value={initialState}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}