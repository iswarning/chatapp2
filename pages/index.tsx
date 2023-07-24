import Head from "next/head";
import SidebarMessage from "@/components/Sidebar/SidebarMessage";
import { useEffect, useState } from "react";
import { NextPageWithLayout } from "./_app";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import Loading from "@/components/Loading";
import {useDispatch, useSelector} from 'react-redux'
import { SidebarType, selectAppState } from "@/redux/appSlice";
import SidebarGroups from "@/components/Sidebar/SidebarGroups";
import SidebarContact from "@/components/Sidebar/SidebarContact";
import SidebarProfile from "@/components/Sidebar/SidebarProfile";
import InfoContentScreen from "@/components/ChatScreen/InfoContentScreen";
import ChatScreen from "@/components/ChatScreen/ChatScreen";
import { selectChatState } from "@/redux/chatSlice";
import { StatusCallType, selectVideoCallState, setGlobalVideoCallState } from "@/redux/videoCallSlice";
import { getLocalStorage, pushMessageToListChat, removeFriendGlobal, removeMessageInListChat, setCurrentChat, setDataVideoCall, setListChat, setListFriend, setListFriendRequest, setShowImageFullScreen, setUserInfo } from "@/services/CacheService";
import ShowImageFullScreen from "@/components/ChatScreen/Message/ShowImageFullScreen";
import { createNewUser, findUserInInitialData, getInitialDataOfUser } from "@/services/UserService";
import { SubscriptionOnCall, SubscriptionOnNotify } from "@/graphql/subscriptions";
import { useSubscription } from "@apollo/client";
import { AlertInfo } from "@/utils/core";
import { getFileByKey } from "@/services/MessageService";
import { MessageType } from "@/types/MessageType";
import { selectFriendState } from "@/redux/friendSlice";
import { selectFriendRequestState } from "@/redux/friendRequestSlice";
import SidebarFriendRequest from "@/components/Sidebar/SidebarFriendRequest";
import PopupVideoCall from "@/components/VideoCallScreen/PopupVideoCall";
import { NotifyResponseType } from "@/types/NotifyResponseType";
import ModalVideoCall from "@/components/VideoCallScreen/ModalVideoCall";

// import '@/styles/tailwind.min.css'
const Page: NextPageWithLayout = () => {
  const [user] = useAuthState(auth);
  const [isLoading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const appState = useSelector(selectAppState);
  const chatState = useSelector(selectChatState);
  const friendState = useSelector(selectFriendState);
  const friendRequestState = useSelector(selectFriendRequestState);
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
        processMessageTypeFile()
        setLoading(false)
      }
    })  
  },[])

  const processMessageTypeFile = () => {
    let listKey = chatState?.listChat?.find((chat) => 
    chat?._id === chatState?.currentChat)?.messages?.filter((msg) => 
    msg.type === "file-uploading").map((msg) => msg.file)
    listKey?.forEach((key) => {
      getFileByKey(key!)
      .then((data) => {
        if(!data) return
        removeMessageInListChat(data._id!, chatState?.currentChat!, dispatch)
        pushMessageToListChat(chatState?.currentChat! ,data ,dispatch)
      })
    })
  }

  // useEffect(() => {
  //   appState.socket.emit("login", { userId: user?.email });
  //   return () => {
  //     appState.socket.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   appState.socket.on("get-user-online", (data) => {
  //     dispatch(setAppGlobalState({
  //       type: "setUserOnline",
  //       data: data
  //     }))
  //   });
  //   return () => {
  //     appState.socket.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //     appState.socket.on("response-call-video-one-to-one", (res: string) => {
  //       let data = JSON.parse(res);
  //       if(data.recipient === user?.email) {
  //           dispatch(setGlobalVideoCallState({
  //             type: "setDataVideoCall",
  //             data: {
  //               chatId: data.chatId,
  //               sender: user?.email,
  //               recipient: data.sender,
  //               isGroup: data.isGroup,
  //             } 
  //           }))
  //           dispatch(setGlobalVideoCallState({
  //             type: "setShowVideoCallScreen",
  //             data: true
  //           }))
  //           dispatch(setGlobalVideoCallState({
  //             type: "setStatusCall",
  //             data: StatusCallType.INCOMING_CALL
  //           }))
  //       }
  //     });
  //     return () => {
  //       appState.socket.disconnect();
  //     };
  // },[])

  // useEffect(() => {
  //   appState.socket.on("response-accept-call-one-to-one", (res: string) => {
  //     let data = JSON.parse(res);
  //     if(data.sender === user?.email) {
  //       dispatch(setGlobalVideoCallState({
  //         type: "setStatusCall",
  //         data: StatusCallType.CALLED
  //       }))
  //     }
  //   })
  //   return () => {
  //     appState.socket.disconnect();
  //   };
  // },[])

  // useEffect(() => {
  //   appState.socket.on('response-reject-call-one-to-one', (res: string) => {
  //     let data = JSON.parse(res);
  //     if(data.recipient === user?.email) {
  //       dispatch(setGlobalVideoCallState({
  //         type: "setShowVideoCallScreen",
  //         data: false
  //       }))
  //     }
  //   });
  //   return () => {
  //     appState.socket.disconnect();
  //   };
  // },[])

  // useEffect(() => {
  //   appState.socket.on("response-notify", (msg: string) => {
  //     const data = JSON.parse(msg);

  //     if(data.type === 'send-message' && data.recipient.includes(user?.email)) {
  //       dispatch(setGlobalChatState({
  //         type: "pushMessageToListChat",
  //         data: data.data
  //       }))
  //       toast(`${data.message}`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
  //     }  

  //     if(data.type === 'accept-friend' && data.recipient.includes(user?.email)) {
  //       dispatch(setGlobalFriendState({
  //         type: "addNewFriend",
  //         data: data.data
  //       }))
  //       toast(`${data.message}`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
  //     }

  //     if(data.type === 'send-add-friend' && data.recipient.includes(user?.email)) {
  //       dispatch(setGlobalFriendState({
  //         type: "addNewFriendRequest",
  //         data: data.data
  //       }))
  //       toast(`${data.message}`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
  //     }  

  //   });
  //   return () => {
  //     appState.socket.disconnect()
  //   }
  // },[])

  const { data: resNotify } = useSubscription(
    SubscriptionOnNotify
  );
  
  useEffect(() => {
    if(resNotify?.onSub?.recipientId?.includes(appState.userInfo._id) && resNotify?.onSub?.senderId !== appState.userInfo._id) {
      switch(resNotify?.onSub?.type){
        case "send-message": {  
          pushMessageToListChat(resNotify?.onSub?.dataNotify?.message?.chatRoomId, resNotify?.onSub?.dataNotify?.message, dispatch)
          AlertInfo( resNotify?.onSub?.message)
          break
        }
        case "unfriend": {
          removeFriendGlobal(resNotify?.onSub?.message, dispatch)
          break
        }
      }
    }
  },[resNotify])

  const { data: resCall } = useSubscription(
    SubscriptionOnCall
  );

  useEffect(() => {
    if(resCall?.onCall?.recipientId?.includes(appState.userInfo._id) && resCall?.onCall?.senderId !== appState.userInfo._id) {
      switch(resCall?.onCall?.type){
        case "send-call": {  
          dispatch(setGlobalVideoCallState({
            type: "setShowVideoCallScreen",
            data: true
          }))
          dispatch(setGlobalVideoCallState({
            type: "setStatusCall",
            data: StatusCallType.INCOMING_CALL
          }));
          setDataVideoCall(resCall?.onCall, dispatch)
          break
        }
        case "accept-call": {
          dispatch(setGlobalVideoCallState({
            type: "setShowVideoCallScreen",
            data: false
          }))
          dispatch(setGlobalVideoCallState({
            type: "setStatusCall",
            data: StatusCallType.CALLED
          }));
          setDataVideoCall(resCall?.onCall, dispatch)
          break
        }
      }
    }
  },[resCall])
  
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
          appState.currentSidebar === SidebarType.SUGGESTION ? <SidebarFriendRequest /> : null
        }

        {
          appState.currentSidebar === SidebarType.PROFILE ? <SidebarProfile /> : null
        }

        {
          chatState.currentChat?.length! > 0 ? <>
            <ChatScreen 
            chat={chatState.listChat.find((chat) => chat._id === chatState.currentChat)!} 
            messages={chatState.listChat.find((chat) => chat._id === chatState.currentChat)?.messages!} />
            {
              appState.showGroupInfo ? <InfoContentScreen /> : null
            }
          </>  : null
        }
        
        </div>
      </div>

      { videoCallState.showVideoCallScreen ? <PopupVideoCall show={videoCallState.showVideoCallScreen} /> : null }

      { videoCallState.statusCall === StatusCallType.CALLED ? <ModalVideoCall /> : null }

      {
        appState.showImageFullScreenData.isShow ? <ShowImageFullScreen 
        urlImage={appState.showImageFullScreenData.urlImage} 
        onHide={() => setShowImageFullScreen(appState.showImageFullScreenData.urlImage,!appState.showImageFullScreenData.isShow, dispatch)}  /> : null
      }
    </>
  );
};

export default Page;
