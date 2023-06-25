import Head from "next/head";
import { Inter } from "next/font/google";
import SidebarMessage from "@/components/Sidebar/SidebarMessage";
import { useEffect, useState } from "react";
import { NextPageWithLayout } from "./_app";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, onMessageListener } from "@/firebase";
import Loading from "@/components/Loading";
import {useDispatch, useSelector} from 'react-redux'
import { SidebarType, StatusCallType, pushMessageToListChat, selectAppState, setAcceptedCall, setCurrentMessages, setDataVideoCall, setListChat, setShowVideoCallScreen, setStatusCall, setUserInfo, setUserOnline } from "@/redux/appSlice";
import SidebarGroups from "@/components/Sidebar/SidebarGroups";
import SidebarContact from "@/components/Sidebar/SidebarContact";
import SidebarProfile from "@/components/Sidebar/SidebarProfile";
import getInitialState from "@/utils/getInitialState";
import VideoCallScreen from "@/components/VideoCallScreen/VideoCallScreen";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import InfoContentScreen from "@/components/ChatScreen/InfoContentScreen";
import ChatScreen from "@/components/ChatScreen/ChatScreen";
import { MapMessageData } from "@/types/MessageType";

const inter = Inter({ subsets: ["latin"] });

// import '@/styles/tailwind.min.css'
const Page: NextPageWithLayout = () => {
  const [user] = useAuthState(auth);
  const [isLoading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const appState = useSelector(selectAppState);
  const router = useRouter();

  useEffect(() => {
    setLoading(true)
    getInitialState(user?.uid).then((data) => {
      dispatch(setUserInfo(data.userInfo))
      dispatch(setListChat(data.listChat))
    })
    .catch(err => console.log(err))
    .finally(() => setLoading(false))
  },[])

  useEffect(() => {
    appState.socket.on("get-user-online", (data) => {
      dispatch(setUserOnline(data))
    });
    return () => {
      appState.socket.disconnect();
    };
  }, []);

  useEffect(() => {
      appState.socket.on("response-call-video-one-to-one", (res: string) => {
        let data = JSON.parse(res);
        if(data.recipient === user?.email) {
            dispatch(setDataVideoCall({
              chatId: data.chatId,
              sender: user?.email,
              recipient: data.sender,
              isGroup: data.isGroup,
            }))
            dispatch(setShowVideoCallScreen(true))
            dispatch(setStatusCall(StatusCallType.INCOMING_CALL))
        }
      });

      // socket.on("response-call-video", (res: string) => {
      //   let data = JSON.parse(res);
      //   if(data.recipient.includes(user?.email)) {
      //       dispatch(setDataVideoCall({
      //         chatId: data.chatId,
      //         sender: data.sender,
      //         recipient: data.recipient,
      //         isGroup: data.isGroup,
      //       }))
      //       dispatch(setShowVideoCallScreen(true))
      //   }
      // });

      appState.socket.on('response-reject-call-one-to-one', (res: string) => {
        console.log(JSON.parse(res))
        let data = JSON.parse(res);
        if(data.recipient === user?.email) {
          dispatch(setShowVideoCallScreen(false))
          toast(`${data.name} rejected the call !`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
        }
      });

      appState.socket.on("response-accept-call-one-to-one", (res: string) => {
        let data = JSON.parse(res);
        if(data.recipient === user?.email) {
          dispatch(setAcceptedCall(true))
        }
      })

      return () => {
        appState.socket.disconnect();
      };
  },[])

  useEffect(() => {
    onMessageListener()
      .then((body: any) => {
        toast(`${body.notification.body}`, {
          hideProgressBar: true,
          autoClose: 5000,
          type: "info",
        });
        recieveMessageAndAdd(body.data.chatId, body.data.messageId)
      })
      .catch((err) => console.log(err));
  },[]);

  useEffect(() => {
      const channel = new BroadcastChannel("notifications");
      channel.addEventListener("message", (event) => {
        recieveMessageAndAdd(event.data.chatId, event.data.messageId)
      });
  },[])

  const recieveMessageAndAdd = async(chatId: string, messageId: string) => {
      const chatExist = appState.listChat.find((c) => c.id === chatId)
      if (!chatExist) return;
      const messExist = chatExist?.messages?.find((mess) => mess.id === messageId)
      if (messExist) {
        return;
      } else {
        const newMessage = await db.collection("chats").doc(chatId).collection("messages").doc(messageId).get()
        dispatch(pushMessageToListChat({ chatId: chatId, newMessage: MapMessageData(newMessage) }))
        if (appState.currentChat.id === chatId) {
          dispatch(setCurrentMessages([ ...appState.currentMessages, MapMessageData(newMessage) ]))
        }
      }
  }

  return (
    <>
      <Loading isShow={isLoading} />
      <Head>
        <title>Chatapp 2.0</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="md:pl-16 pt-16">
        <div className="-mt-16 ml-auto xl:-ml-16 mr-auto xl:pl-16 pt-16 xl:h-screen w-auto sm:w-3/5 xl:w-auto grid grid-cols-12 gap-6">
        {
          appState.currentSidebar === SidebarType.CHAT ? <SidebarMessage /> : null
        }

        {
          appState.currentSidebar === SidebarType.GROUPS ? <SidebarGroups /> : null
        }

        {
          appState.currentSidebar === SidebarType.CONTACTS ? <SidebarContact /> : null
        }

        {
          appState.currentSidebar === SidebarType.PROFILE ? <SidebarProfile /> : null
        }

        {
          Object.keys(appState.currentChat).length > 0 ? <>
            <ChatScreen chat={appState.currentChat} messages={appState.currentMessages} />
            <InfoContentScreen />
          </>  : null
        }

        { appState.showVideoCallScreen ? <VideoCallScreen open={appState.showVideoCallScreen} /> : null }
        </div>
      </div>
    </>
  );
};

export default Page;
