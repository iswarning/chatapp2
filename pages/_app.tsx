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
import getUserBusy from '@/utils/getUserBusy';
import popupCenter from '@/utils/popupCenter';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const [user, loading] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [chatRoomId, setChatRoomId] = useState('')
  const [sender, setSender] = useState('')
  const [recipient, setRecipient] = useState([])
  const [isGroup, setIsGroup] = useState(false);
  const router = useRouter();

  const socketRef: any = useRef();
  socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);

  useEffect(() => {

    if(user) {
      createNewUser(user).catch((err) => console.log(err));
      getNotificationMessage(user, socketRef.current);
      
      socketRef.current.on("response-call-video", (res: string) => {
        let data = JSON.parse(res);
        if(data.recipient.includes(user?.email)) {
            setChatRoomId(data.chatId);
            setSender(data.sender);
            setRecipient(data.recipient);
            setIsGroup(data.isGroup);
            if(!isOpen) {
              setIsOpen(true);
            }
        }
      });

      socketRef.current.on('response-reject-call', (res: string) => {
        let data = JSON.parse(res);
        if(data.recipient.includes(user?.email)) {
          if (!data.isGroup) {
            setIsOpen(false);
          } else {
            getUserBusy().then((d) => {
              if(d.length === 1) {
                setIsOpen(false);
              }
            }).catch((err) => console.log(err))
          }
          toast(`${data.name} rejected the call !`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
        }
      });

      // socketRef.current.on("response-accept-call", (res: string) => {
      //   let data = JSON.parse(res);
      //   if(data.recipient.includes(user?.email)) {
      //     window.open(router.basePath + "/video-call/" + data.chatId);
      //   }
      // })

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
        <VideoCallScreen statusCall='Incoming Call' photoURL={user?.photoURL} sender={sender} recipient={recipient}  chatId={chatRoomId}  onClose={() => setIsOpen(false)} isGroup={isGroup} />
    </VideoCallContainer>
  </> 
  
}
