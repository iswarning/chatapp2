import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import Login from './login';
import { ReactElement, ReactNode, useEffect, useRef, useState } from 'react';
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
import Layout from '@/components/Layout';
import { NextPage } from 'next';
import { config } from '@fortawesome/fontawesome-svg-core'
import '../node_modules/@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
 
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [user, loading] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [chatRoomId, setChatRoomId] = useState('')
  const [sender, setSender] = useState('')
  const [recipient, setRecipient] = useState([])
  const [isGroup, setIsGroup] = useState(false);
  const router = useRouter();

  const socketRef: any = useRef();
  const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
  socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!)

  useEffect(() => {

    if(user) {
      createNewUser(user).catch((err) => console.log(err));

      getNotificationMessage(user, socket);
      
      socket.on("response-call-video-one-to-one", (res: string) => {
        let data = JSON.parse(res);
        if(data.recipient === user?.email) {
            setChatRoomId(data.chatId);
            setSender(data.sender);
            setRecipient(data.recipient);
            setIsGroup(data.isGroup);
            setIsOpen(true);
        }
      });


      // socket.on("response-call-video", (res: string) => {
      //   let data = JSON.parse(res);
      //   if(data.recipient.includes(user?.email)) {
      //       setChatRoomId(data.chatId);
      //       setSender(data.sender);
      //       setRecipient(data.recipient);
      //       setIsGroup(data.isGroup);
      //       if(!isOpen) {
      //         setIsOpen(true);
      //       }
      //   }
      // });

      socket.on('response-reject-call-one-to-one', (res: string) => {
        let data = JSON.parse(res);
        if(data.recipient === user?.email) {
          setIsOpen(false);
          toast(`${data.name} rejected the call !`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
        }
      });

      // socket.on("response-accept-call-one-to-one", (res: string) => {
      //   let data = JSON.parse(res);
      //   if(data.recipient === user?.email) {
      //     // window.open(router.basePath + "/video-call/" + data.chatId);
      //   }
      // })

      return () => {
        socket.disconnect()
      }

    }
  },[user]);

  if(!user) return <Login/>

  if(loading) return <Loading />
  
  // return <>
  //   <Layout>
  //     <Component {...pageProps} />
  //   </Layout>
    
  //   <ToastContainer />
  //   <VideoCallContainer isOpen={isOpen} ariaHideApp={false}>
  //       <VideoCallScreen statusCall='Incoming Call' photoURL={user?.photoURL} sender={recipient} recipient={sender}  chatId={chatRoomId}  onClose={() => setIsOpen(false)} isGroup={isGroup} />
  //   </VideoCallContainer>
  // </> 

  const getLayout = Component.getLayout ?? ((page) => page);
 
  return getLayout(<Component {...pageProps} />);
  
}
