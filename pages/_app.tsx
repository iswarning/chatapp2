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
import { ToastContainer, toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { VideoCallContainer } from '@/components/ChatScreen/ChatScreenStyled';
import VideoCallScreen from '@/components/VideoCallScreen/VideoCallScreen';
import EventEmitter from 'events';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [chatRoomId, setChatRoomId] = useState('')
  const [senderId, setSenderId] = useState('')
  const router = useRouter();

  const socketRef: any = useRef();
  socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
  // socketRef.current = io("http://localhost:9000");

  useEffect(() => {

    if(user) {
      createNewUser(user);
      getNotificationMessage(user, socketRef.current);
      
      socketRef.current.on("response-call", (senderCall: any, recipientCall: any, chatId: any) => {
        if(recipientCall === user?.uid) {
            setChatRoomId(chatId);
            setSenderId(senderCall);
            setIsOpen(true);
        }
      });

      socketRef.current.on('response-reject', (res: string) => {
        let data = JSON.parse(res);
        if(data.recipientId === user?.uid) {
          setIsOpen(false);
          toast(`${data.name} rejected the call !`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
        }
      });

      return () => {
        socketRef.current.disconnect()
      }

    }
  },[user]);

  if(!user) return <Login/>

  if(loading) return <Loading />
  
  return <>
    <Component {...pageProps} />
    <ToastContainer />
    <VideoCallContainer isOpen={isOpen} ariaHideApp={false}>
        <VideoCallScreen statusCall='Incoming Call' photoURL={user?.photoURL} senderId={senderId} recipientId={user?.uid}  chatId={chatRoomId} currentScreen="any"  onClose={() => setIsOpen(false)} />
    </VideoCallContainer>
  </> 
  
}
