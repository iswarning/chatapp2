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
import VideoCallScreen from "@/components/VideoCallScreen/VideoCallScreen";
import { toast } from "react-toastify";
import InfoContentScreen from "@/components/ChatScreen/InfoContentScreen";
import ChatScreen from "@/components/ChatScreen/ChatScreen";
import { selectChatState, setGlobalChatState } from "@/redux/chatSlice";
import { StatusCallType, selectVideoCallState, setGlobalVideoCallState } from "@/redux/videoCallSlice";
import { selectFriendState, setGlobalFriendState } from "@/redux/friendSlice";
import { getLocalStorage, setCurrentChat, setListChat, setListFriend, setListFriendRequest, setShowImageFullScreen, setUserInfo } from "@/services/CacheService";
import ShowImageFullScreen from "@/components/ChatScreen/Message/ShowImageFullScreen";
import { createNewUser, getInitialDataOfUser } from "@/services/UserService";

// import '@/styles/tailwind.min.css'
const Page: NextPageWithLayout = () => {
  const [user] = useAuthState(auth);
  const [isLoading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const appState = useSelector(selectAppState);
  const chatState = useSelector(selectChatState);
  const videoCallState = useSelector(selectVideoCallState);

  useEffect(() => {
    setLoading(true)
    localStorage.clear()
    createNewUser({
      email: user?.email!,
      fullName: user?.displayName!,
      photoURL: user?.photoURL!
    }).then(userInfo => {
      if (!getLocalStorage("UserInfo")) {
        getInitialDataOfUser(userInfo?._id).then((data) => {
          if(data) {
            setUserInfo(data.userInfo, dispatch)
            setListFriend(data.listFriend, dispatch)
            setListFriendRequest(data.listFriendRequest, dispatch)
            setListChat(data.listChatRoom, dispatch)
          }
        })
        .catch(err => console.log(err))
        .finally(() => setLoading(false))
      } else {
        setUserInfo(getLocalStorage("UserInfo"), dispatch)
        setListFriend(getLocalStorage("ListFriend"), dispatch)
        setListFriendRequest(getLocalStorage("ListFriendRequest"), dispatch)
        setListChat(getLocalStorage("ListChat"), dispatch)
        getLocalStorage("CurrentChat") ? setCurrentChat(getLocalStorage("CurrentChat"), dispatch) : null;
        setLoading(false)
      }
    })  
  },[])

  useEffect(() => {
    appState.socket.emit("login", { userId: user?.email });
    return () => {
      appState.socket.disconnect();
    };
  }, []);

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
            <ChatScreen chat={chatState.currentChat} messages={chatState.currentChat.messages!} />
            <InfoContentScreen />
          </>  : null
        }

        { videoCallState.showVideoCallScreen ? <VideoCallScreen open={videoCallState.showVideoCallScreen} /> : null }

        {
          appState.showImageFullScreenData.isShow ? <ShowImageFullScreen 
          urlImage={appState.showImageFullScreenData.urlImage} 
          onHide={() => setShowImageFullScreen(appState.showImageFullScreenData.urlImage,!appState.showImageFullScreenData.isShow, dispatch)}  /> : null
        }
        </div>
      </div>
    </>
  );
};

export default Page;
