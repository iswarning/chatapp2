import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import Login from './login';
import { useEffect, useRef, useState } from 'react';
import createNewUser from '@/services/users/createNewUser';
import 'bootstrap/dist/css/bootstrap.css';
import getNotificationMessage from '@/utils/getNotificationMessage';
import { auth } from '@/firebase';
import Loading from '@/components/Loading';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { io } from 'socket.io-client';
import VideoCallScreen from '@/components/VideoCallScreen/VideoCallScreen';
import { VideoCallContainer } from '@/components/ChatScreen/ChatScreenStyled';

export default function App({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);
  const [isOpenModal, setIsOpenModal] = useState(false)
  const socketRef: any = useRef();
  const [chatRoomId, setChatRoomId] = useState('')
  const [reciId, setReciId] = useState('')
  socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);

  useEffect(() => {
    if(user) {
      createNewUser(user);
      getNotificationMessage(user, socketRef);
      socketRef.current.on("response-call", (userId, recipientId, chatId) => {
        if(recipientId === user.uid) {
          setChatRoomId(chatId)
          setReciId(recipientId)
          setIsOpenModal(!isOpenModal)
        }
      })
      return () => {
        socketRef.current.disconnect();
      };
    }
  },[user]);

  if(!user) return <Login/>

  if(loading) return <Loading />
  
  return <>
    <Component {...pageProps} />
    <ToastContainer />
    <VideoCallContainer isOpen={isOpenModal} onRequestClose={() => setIsOpenModal(!isOpenModal)}>
      <VideoCallScreen statusCall='Incoming Call' photoURL={user?.photoURL} recipiendId={reciId} chatId={chatRoomId} />
    </VideoCallContainer>
  </> 
  
}
