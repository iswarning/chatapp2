import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'
import Login from './login';
import Loading from '@/components/Loading';
import { useEffect } from 'react';
import createNewUser from '@/services/users/createNewUser';
import 'bootstrap/dist/css/bootstrap.css'
import getNotificationMessage from '@/utils/getNotificationMessage';

export default function App({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if(user) {
      createNewUser(user);
      getNotificationMessage(user);
    }
  },[user]);

  if(loading) return <Loading />
  if(!user) return <Login/>
  
  return <Component {...pageProps} />
}
