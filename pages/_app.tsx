import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import Login from './login';
import { useEffect, useState } from 'react';
import createNewUser from '@/services/users/createNewUser';
import 'bootstrap/dist/css/bootstrap.css';
import getNotificationMessage from '@/utils/getNotificationMessage';
import { auth } from '@/firebase';
import Loading from '@/components/Loading';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { VideoCallContainer } from '@/components/ChatScreen/ChatScreenStyled';
import VideoCallScreen from '@/components/VideoCallScreen/VideoCallScreen';
import EventEmitter from 'events';

export default function App({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [chatRoomId, setChatRoomId] = useState('')
  const [senderId, setSenderId] = useState('')

  const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!,{
    path: process.env.NEXT_PUBLIC_SOCKET_IO_PATH!
  });

  useEffect(() => {

    if(user) {
      createNewUser(user);
      getNotificationMessage(user, socket);
      
      socket.on("response-call", (senderCall, recipientCall, chatId) => {
        if(recipientCall === user?.uid) {
            setChatRoomId(chatId);
            setSenderId(senderCall);
            setIsOpen(true);
        }
      });

      socket.on('response-reject', (recipientCall, recipientName, statusCall, chatId) => {
        if(recipientCall === user?.uid) {
          setIsOpen(false);
          if(statusCall === 'Calling') {
            toast(`${recipientName} rejected the call !`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
          }
        }
      });

      return () => {
        socket.disconnect()
      }

    }
  },[user]);

  if(!user) return <Login/>

  if(loading) return <Loading />
  
  return <>
    <Component {...pageProps} />
    <ToastContainer />
    <VideoCallContainer isOpen={isOpen} >
        <VideoCallScreen statusCall='Incoming Call' photoURL={user?.photoURL} senderId={senderId} recipientId={user?.uid} chatId={chatRoomId} onClose={() => setIsOpen(false)} />
    </VideoCallContainer>
  </> 
  
}
