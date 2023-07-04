import Head from "next/head";
import { Inter } from "next/font/google";
import SidebarMessage from "@/components/Sidebar/SidebarMessage";
import { useEffect, useState } from "react";
import { NextPageWithLayout } from "./_app";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import Loading from "@/components/Loading";
import {useDispatch, useSelector} from 'react-redux'
import { SidebarType, selectAppState, setAppGlobalState } from "@/redux/appSlice";
import SidebarGroups from "@/components/Sidebar/SidebarGroups";
import SidebarContact from "@/components/Sidebar/SidebarContact";
import SidebarProfile from "@/components/Sidebar/SidebarProfile";
import getInitialState from "@/utils/getInitialState";
import VideoCallScreen from "@/components/VideoCallScreen/VideoCallScreen";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import InfoContentScreen from "@/components/ChatScreen/InfoContentScreen";
import ChatScreen from "@/components/ChatScreen/ChatScreen";
import DropdownActionUser from "@/components/DropdownActionUser";
import { selectChatState, setGlobalChatState } from "@/redux/chatSlice";
import { selectMessageState } from "@/redux/messageSlice";
import { StatusCallType, selectVideoCallState, setGlobalVideoCallState } from "@/redux/videoCallSlice";
import getNotification from "@/utils/getNotifications";
import { setGlobalFriendState } from "@/redux/friendSlice";
import { setGlobalFriendRequestState } from "@/redux/friendRequestSlice";

const inter = Inter({ subsets: ["latin"] });

// import '@/styles/tailwind.min.css'
const Page: NextPageWithLayout = () => {
  const [user] = useAuthState(auth);
  const [isLoading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const appState = useSelector(selectAppState);
  const chatState = useSelector(selectChatState);
  const messageState = useSelector(selectMessageState);
  const videoCallState = useSelector(selectVideoCallState);

  useEffect(() => {
    setLoading(true)
    getInitialState(user?.uid).then((data) => {
      dispatch(setAppGlobalState({
        type: "setUserInfo",
        data: data.userInfo
      }))
      dispatch(setGlobalFriendState({
        type: "setListFriend",
        data: data.listFriend
      }))
      dispatch(setGlobalFriendRequestState({
        type: "setListFriendRequest",
        data: data.listFriendRequest
      }))
      dispatch(setGlobalChatState({
        type: "setListChat",
        data: data.listChat
      }))
    })
    .catch(err => console.log(err))
    .finally(() => setLoading(false))
  },[])

  useEffect(() => {
    appState.socket.on("get-user-online", (data) => {
      dispatch(setAppGlobalState({
        type: "setUserOnline",
        data: data
      }))
    });
    return () => {
      appState.socket.disconnect();
    };
  }, []);

  useEffect(() => {
      appState.socket.on("response-call-video-one-to-one", (res: string) => {
        let data = JSON.parse(res);
        if(data.recipient === user?.email) {
            dispatch(setGlobalVideoCallState({
              type: "setDataVideoCall",
              data: {
                chatId: data.chatId,
                sender: user?.email,
                recipient: data.sender,
                isGroup: data.isGroup,
              } 
            }))
            dispatch(setGlobalVideoCallState({
              type: "setShowVideoCallScreen",
              data: true
            }))
            dispatch(setGlobalVideoCallState({
              type: "setStatusCall",
              data: StatusCallType.INCOMING_CALL
            }))
        }
      });
      return () => {
        appState.socket.disconnect();
      };
  },[])

  useEffect(() => {
    appState.socket.on("response-accept-call-one-to-one", (res: string) => {
      let data = JSON.parse(res);
      if(data.sender === user?.email) {
        dispatch(setGlobalVideoCallState({
          type: "setStatusCall",
          data: StatusCallType.CALLED
        }))
      }
    })
    return () => {
      appState.socket.disconnect();
    };
  },[])

  useEffect(() => {
    appState.socket.on('response-reject-call-one-to-one', (res: string) => {
      let data = JSON.parse(res);
      if(data.recipient === user?.email) {
        dispatch(setGlobalVideoCallState({
          type: "setShowVideoCallScreen",
          data: false
        }))
      }
    });
    return () => {
      appState.socket.disconnect();
    };
  },[])

  useEffect(() => {
    appState.socket.on("response-notify", (msg: string) => {
      const data = JSON.parse(msg);

      if(data.type === 'send-message' && data.recipient.includes(user?.email)) {
        dispatch(setGlobalChatState({
          type: "pushMessageToListChat",
          data: data.data
        }))
        toast(`${data.message}`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
      }  

      if(data.type === 'accept-friend' && data.recipient.includes(user?.email)) {
        dispatch(setGlobalFriendState({
          type: "addNewFriend",
          data: data.data
        }))
        toast(`${data.message}`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
      }

      if(data.type === 'send-add-friend' && data.recipient.includes(user?.email)) {
        dispatch(setGlobalFriendState({
          type: "addNewFriendRequest",
          data: data.data
        }))
        toast(`${data.message}`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
      }  

    });
    return () => {
      appState.socket.disconnect()
    }
  },[])

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
          Object.keys(chatState.currentChat).length > 0 ? <>
            <ChatScreen chat={chatState.currentChat} messages={messageState.currentMessages} />
            <InfoContentScreen />
          </>  : null
        }

        { videoCallState.showVideoCallScreen ? <VideoCallScreen open={videoCallState.showVideoCallScreen} /> : null }
        </div>
      </div>
    </>
  );
};

export default Page;
