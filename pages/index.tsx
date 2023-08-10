import Head from "next/head";
import SidebarMessage from "@/components/Sidebar/SidebarMessage";
import { useEffect, useState } from "react";
import { NextPageWithLayout } from "./_app";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, storage } from "@/firebase";
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
import { addNewFileInRoom, addNewFriend, addNewFriendRequest, addNewImageInRoom, getLocalStorage, pushMessageToCache, removeFriendGlobal, removeFriendRequestGlobal, removeMessageInListChat, setCurrentChat, setDataVideoCall, setListChat, setListFriend, setListFriendRequest, setShowImageFullScreen, setUserInfo } from "@/services/CacheService";
import ShowImageFullScreen from "@/components/ChatScreen/Message/ShowImageFullScreen";
import { createNewUser, getInitialDataOfUser } from "@/services/UserService";
import { SubscriptionOnCall, SubscriptionOnNotify } from "@/graphql/subscriptions";
import { useSubscription } from "@apollo/client";
import { AlertInfo } from "@/utils/core";
import { updateMessage } from "@/services/MessageService";
import SidebarFriendRequest from "@/components/Sidebar/SidebarFriendRequest";
import PopupVideoCall from "@/components/VideoCallScreen/PopupVideoCall";
import ModalVideoCall from "@/components/VideoCallScreen/ModalVideoCall";
import { DataNotify, NotifyResponseType } from "@/types/NotifyResponseType";
import mime from 'mime-types'
import DownloadMultipleFile from "@/components/DownloadMultipleFile";
import { selectFriendRequestState } from "@/redux/friendRequestSlice";
import { selectFriendState } from "@/redux/friendSlice";

// import '@/styles/tailwind.min.css'
const Page: NextPageWithLayout = () => {
  const [user] = useAuthState(auth);
  const [isLoading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const appState = useSelector(selectAppState);
  const chatState = useSelector(selectChatState);
  const friendRequestState = useSelector(selectFriendRequestState);
  const friendState = useSelector(selectFriendState);
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
        if (getLocalStorage("CurrentChat"))
          setCurrentChat(getLocalStorage("CurrentChat"), dispatch)
        // processMessageTypeFile()
        setLoading(false)
      }
    })  
  },[])

  // const processMessageTypeFile = () => {
  //   let listKey = chatState?.listChat?.find((chat) => 
  //   chat?._id === chatState?.currentChat.chatRoomId)?.messages?.filter((msg) => 
  //   msg.type === "file-uploading")
  //   listKey?.forEach((message) => {
  //     updateMessage({
  //       ...message,
  //       type: "file",
  //     })
  //   })
  // }

  const { data: resNotify } = useSubscription(
    SubscriptionOnNotify
  );
  
  useEffect(() => {
    if(resNotify?.onSubscription?.recipientId?.includes(appState.userInfo._id) && resNotify?.onSubscription?.senderId !== appState.userInfo._id) {
      switch(resNotify?.onSubscription?.type){
        case "send-message": {  
          const dataNotify: DataNotify = resNotify?.onSubscription?.dataNotify
          if (chatState.currentChat.index !== -1) {
            if (chatState.currentChat.chatRoomId === dataNotify.message?.chatRoomId) {
              pushMessageToCache(chatState.currentChat.index, dataNotify.message, dispatch)
              if (dataNotify.message.type === "image") {
                const listKey: string[] = JSON.parse(dataNotify.message.message!)
                for (const key in listKey) {
                  const ref = storage.ref(key)
                  ref.getMetadata().then(metadata => {
                    ref.getDownloadURL().then(url => {
                      addNewImageInRoom(chatState.currentChat.index, {
                        url,
                        key,
                        name: key,
                        size: metadata.size,
                        extension: String(mime.extension(metadata.contentType)),
                        timeCreated: metadata.timeCreated
                      }, dispatch)
                    })
                  })
                }
              }

              if (dataNotify.message.type === "file") { 
                const ref = storage.ref(dataNotify.message.message)
                  ref.getMetadata().then(metadata => {
                    ref.getDownloadURL().then(url => {
                      addNewFileInRoom(chatState.currentChat.index, {
                        url,
                        key: dataNotify.message?.message!,
                        name: dataNotify.message?.message!,
                        size: metadata.size,
                        extension: String(mime.extension(metadata.contentType)),
                        timeCreated: metadata.timeCreated
                      }, dispatch)
                    })
                })
              }

              AlertInfo(resNotify?.onSubscription?.message)
            } else {
              const index = chatState.listChat.findIndex((chat) => chat._id === dataNotify.message?.chatRoomId)
              if (index !== -1 && chatState.listChat[index].messages?.length! > 0) {
                pushMessageToCache(index, dataNotify.message!, dispatch)
                AlertInfo( resNotify?.onSubscription?.message)
              }
            }
          }
          break
        }
        case "send-friend-request": {
          addNewFriendRequest({
            senderId: resNotify?.onSubscription?.senderId,
            recipientId: resNotify?.onSubscription?.recipientId
          }, dispatch)
          AlertInfo(resNotify?.onSubscription?.message)
          break
        }
        case "accept-friend-request": {
          addNewFriend({
            senderId: resNotify?.onSubscription?.senderId,
            recipientId: resNotify?.onSubscription?.recipientId
          }, dispatch)
          AlertInfo(resNotify?.onSubscription?.message)
          break
        }
        case "remove-friend-request": {
          removeFriendRequestGlobal(
            friendRequestState.listFriendRequest.findIndex((f) => f._id === resNotify?.onSubscription?.message), 
            dispatch
          )
          break
        }
        case "unfriend": {
          removeFriendGlobal(friendState.listFriend.findIndex((item) => item._id === resNotify?.onSubscription?.message), dispatch)
          break
        }
      }
    }
  },[resNotify])

  const { data: resCall } = useSubscription(
    SubscriptionOnCall
  );

  useEffect(() => {
    if (resCall) {
      const response = JSON.parse(resCall?.onCall) as NotifyResponseType
      if(response?.recipientId?.includes(appState.userInfo._id!) && response.senderId !== appState.userInfo._id) {
        switch(response.type){
          case "send-call": {  
            dispatch(setGlobalVideoCallState({
              type: "setShowVideoCallScreen",
              data: true
            }))
            dispatch(setGlobalVideoCallState({
              type: "setStatusCall",
              data: StatusCallType.INCOMING_CALL
            }));
            setDataVideoCall(response, dispatch)
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
            setDataVideoCall(response, dispatch)
            break
          }
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
          appState.currentSidebar === SidebarType.FRIEND_REQUEST ? <SidebarFriendRequest /> : null
        }

        {
          appState.currentSidebar === SidebarType.PROFILE ? <SidebarProfile /> : null
        }

        {
          chatState.currentChat.chatRoomId ? <>
            <ChatScreen 
            chat={chatState.listChat[chatState.currentChat.index]} 
            messages={chatState.listChat[chatState.currentChat.index].messages!} />
            {
              appState.showGroupInfo ? <InfoContentScreen /> : null
            }
          </>  : null
        }
        
        </div>
      </div>

      { videoCallState.showVideoCallScreen ? <PopupVideoCall show={videoCallState.showVideoCallScreen} /> : null }

      { videoCallState.statusCall === StatusCallType.CALLED ? <ModalVideoCall token={videoCallState?.notifyResponse?.dataVideoCall?.accessToken!} channel={videoCallState?.notifyResponse?.dataVideoCall?.chatRoomId!} /> : null }

      {
        appState.showImageFullScreenData.isShow ? <ShowImageFullScreen 
        urlImage={appState.showImageFullScreenData.urlImage} 
        onHide={() => setShowImageFullScreen(appState.showImageFullScreenData.urlImage,!appState.showImageFullScreenData.isShow, dispatch)}  /> : null
      }

      { appState.downloadMultipleFile.isShow ? <DownloadMultipleFile /> : null }
    </>
  );
};

export default Page;
