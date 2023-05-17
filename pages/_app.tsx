import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import Login from './login';
import { useEffect, useRef } from 'react';
import createNewUser from '@/services/users/createNewUser';
import 'bootstrap/dist/css/bootstrap.css';
import getNotificationMessage from '@/utils/getNotificationMessage';
import { auth } from '@/firebase';
import Loading from '@/components/Loading';
import { io } from 'socket.io-client';

export default function App({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if(user) {
      createNewUser(user);
      getNotificationMessage(user);
      
    }
  },[user]);

  if(!user) return <Login/>

  if(loading) return <Loading />
  
  return <Component {...pageProps} />
}
