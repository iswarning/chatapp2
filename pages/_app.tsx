import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { useAuthState } from 'react-firebase-hooks/auth'
import Login from './login';
import { ReactElement, ReactNode, createContext, useEffect, useRef, useState } from 'react';
import createNewUser from '@/services/users/createNewUser';
import 'bootstrap/dist/css/bootstrap.css';
import { auth, db, getMessagingToken, onMessageListener } from '@/firebase';
// import { auth, getMessagingToken, onMessageListener } from '@/firebase';
import Loading from '@/components/Loading';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { config } from '@fortawesome/fontawesome-svg-core'
import '../node_modules/@fortawesome/fontawesome-svg-core/styles.css'
import getNotification from '@/utils/getNotifications';
import requestPermission from '@/utils/requestPermission';
import { AppWrapper, useAppContext } from '@/context/AppContext';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query'
config.autoAddCss = false

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};
 
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const { children, ...rest } = pageProps;
  const [user, loading] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);
  const [chatRoomId, setChatRoomId] = useState('')
  const [sender, setSender] = useState('')
  const [recipient, setRecipient] = useState([])
  const [isGroup, setIsGroup] = useState(false);
  const router = useRouter();
  const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
  const socketRef: any = useRef();
  socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
const context: any = useAppContext();
const queryClient = new QueryClient()
  useEffect(() => {
    if(user) {
      createNewUser(user).catch((err) => console.log(err));
      requestPermission()
      getNotification(user?.email)

      // socketRef.current.emit('login',{userId: user?.email});

      // return () => {
      //   socketRef.current.disconnect()
      // }
      

      // getNotificationMessage(user?.email, socket);

      // getNotificationAddFriend(user?.email, socket);

      // getNotificationAcceptFriend(user?.email, socket);

      

      const channel = new BroadcastChannel("notifications");
      channel.addEventListener("message", (event) => {
        console.log(event.data);
          new Notification("New nofitication", { body: event.data.notification.body })
      });
      
      // socket.on("response-call-video-one-to-one", (res: string) => {
      //   let data = JSON.parse(res);
      //   if(data.recipient === user?.email) {
      //       setChatRoomId(data.chatId);
      //       setSender(data.sender);
      //       setRecipient(data.recipient);
      //       setIsGroup(data.isGroup);
      //       setIsOpen(true);
      //   }
      // });


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

      // socket.on('response-reject-call-one-to-one', (res: string) => {
      //   let data = JSON.parse(res);
      //   if(data.recipient === user?.email) {
      //     setIsOpen(false);
      //     toast(`${data.name} rejected the call !`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
      //   }
      // });

      // socket.on("response-accept-call-one-to-one", (res: string) => {
      //   let data = JSON.parse(res);
      //   if(data.recipient === user?.email) {
      //     // window.open(router.basePath + "/video-call/" + data.chatId);
      //   }
      // })
      // socketRef.current.on("disconnect", () => {
      //   console.log(socketRef.current.disconnected); // true
      // });
      // return () => {
      //   socket.disconnect()
      // }
      window.addEventListener("beforeunload", () => setUserOffline());
      return () => {
        window.addEventListener("beforeunload", () => setUserOffline());
      }
    }
  },[user]);

  const setUserOffline = () => {
    try {
        db.collection("users").doc(user?.uid).update({ isOnline: false })
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    onMessageListener().then((data: any) => {
      toast(`${data.notification.body}`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
    })
  })

  // useEffect(() => {
  //   getMessagingToken()
  // },[])

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
 
  return getLayout(
    <QueryClientProvider client={queryClient}>
      <AppWrapper>
        {context?.getToken()}
        <Component {...pageProps} />
        <ToastContainer />
      </AppWrapper>
    </QueryClientProvider>
    
  );
  
}
