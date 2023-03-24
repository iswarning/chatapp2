import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import {auth, db} from '../firebase'
import Login from './login';
import Loading from '@/components/Loading';
import { useEffect } from 'react';
import { collection, doc, setDoc, serverTimestamp} from 'firebase/firestore/lite'

export default function App({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if(user) {
      createNewUser();
    }
  },[user])

  const createNewUser = async () => {
    const userCollection = collection(db, 'users');
    const userDoc = doc(userCollection, 'users');
    await setDoc(userDoc, {
      email: user?.email,
      lastSeen: serverTimestamp(),
      photoURL: user?.photoURL,
    }, { merge: true });
  }

  if(loading) return <Loading />
  if(!user) return <Login/>
  
  return <Component {...pageProps} />
}
