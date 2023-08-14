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
import { StatusCallType, selectVideoCallState } from "@/redux/videoCallSlice";
import { addNewFileInRoom, addNewFriend, addNewFriendRequest, addNewImageInRoom, getLocalStorage, pushMessageToCache, removeFriendGlobal, removeFriendRequestGlobal, removeMessageInListChat, setCurrentChat, setDataVideoCall, setListChat, setListFriend, setListFriendRequest, setListMessageInRoom, setShowImageFullScreen, setShowVideoCallScreen, setStatusCall, setUserInfo } from "@/services/CacheService";
import ShowImageFullScreen from "@/components/ChatScreen/Message/ShowImageFullScreen";
import { createNewUser, getInitialDataOfUser } from "@/services/UserService";
import { SubscriptionOnNotify } from "@/graphql/subscriptions";
import { useSubscription } from "@apollo/client";
import { AlertInfo } from "@/utils/core";
import { getLastMessage, paginateMessage, updateMessage } from "@/services/MessageService";
import SidebarFriendRequest from "@/components/Sidebar/SidebarFriendRequest";
import PopupVideoCall from "@/components/VideoCallScreen/PopupVideoCall";
import ModalVideoCall from "@/components/VideoCallScreen/ModalVideoCall";
import { NotifyResponseType } from "@/types/NotifyResponseType";
import mime from 'mime-types'
import DownloadMultipleFile from "@/components/DownloadMultipleFile";
import { selectFriendRequestState } from "@/redux/friendRequestSlice";
import { selectFriendState } from "@/redux/friendSlice";
import { MessageType } from "@/types/MessageType";

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

  const currentIndexChat = chatState.currentChat.index
  const currentChatRoomId = chatState.currentChat.chatRoomId

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
        if (getLocalStorage("CurrentChat")) {
          setCurrentChat(getLocalStorage("CurrentChat"), dispatch)
          reloadNewMessages()
        }
        setLoading(false)
      }
    })  
  },[])

  const reloadNewMessages = async() => {
    let listKey = chatState?.listChat?.find((chat) => 
    chat?._id === chatState?.currentChat.chatRoomId)?.messages?.filter((msg) => 
    msg.type === "file-uploading")
    listKey?.forEach((message) => {
      updateMessage({
        ...message,
        message: JSON.parse(message.message!).key,
        type: "file",
      })
    })
    const lastMessageDB: MessageType = await getLastMessage(currentChatRoomId)
    const lastMessageCache = chatState.listChat[currentIndexChat].messages?.[chatState.listChat[currentIndexChat].messages?.length! - 1]
    if (lastMessageCache?.type === "text" && lastMessageDB._id !== lastMessageCache?._id) {
      setListMessageInRoom(currentIndexChat, await paginateMessage({ chatRoomId: currentChatRoomId, n: 0 }), dispatch)
    }
  }

  const { data: resNotify } = useSubscription(
    SubscriptionOnNotify
  );
  
  useEffect(() => {
    if (!resNotify) return
    const result = JSON.parse(resNotify?.onSubscription) as NotifyResponseType
    if(result.recipientId?.includes(appState.userInfo._id!) && result?.senderId !== appState.userInfo._id) {
      switch(result.type){   
        case "send-message": {  
          sendMessage(result)
          break
        }
        case "send-friend-request": {
          sendFriendRequest(result)
          break
        }
        case "accept-friend-request": {
          acceptFriendRequest(result)
          break
        }
        case "remove-friend-request": {
          removeFriendRequestGlobal(
            friendRequestState.listFriendRequest.findIndex((f) => f._id === result.message), 
            dispatch
          )
          break
        }
        case "unfriend": {
          removeFriendGlobal(
            friendState.listFriend.findIndex((item) => item._id === result?.message), 
            dispatch
          )
          break
        }
        
        // video call
        case "send-call": {  
          sendCall(result)
          break
        }
        case "accept-call": {
          acceptCall(result)
          break
        }
      }
    }
  },[resNotify])

  const sendMessage = (result: NotifyResponseType) => {
    if (!result?.dataNotify) return
    const dataNotify = result?.dataNotify
    if (currentIndexChat !== -1) {
      if (currentChatRoomId === dataNotify.message?.chatRoomId) {
        pushMessageToCache(currentIndexChat, dataNotify.message, dispatch)
        if (dataNotify.message.type === "image") {
          const listKey: string[] = JSON.parse(dataNotify.message.message!)
          for (const key in listKey) {
            const ref = storage.ref(key)
            ref.getMetadata().then(metadata => {
              ref.getDownloadURL().then(url => {
                addNewImageInRoom(currentIndexChat, {
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
                addNewFileInRoom(currentIndexChat, {
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

        AlertInfo(result?.message!)
      } else {
        const index = chatState.listChat.findIndex((chat) => chat._id === dataNotify.message?.chatRoomId)
        if (index !== -1 && chatState.listChat[index].messages?.length! > 0) {
          pushMessageToCache(index, dataNotify.message!, dispatch)
          AlertInfo( result?.message!)
        }
      }
    }
  }

  const sendFriendRequest = (result: NotifyResponseType) => {
    addNewFriendRequest({
      senderId: result?.senderId,
      recipientId: result?.recipientId!
    }, dispatch)
    AlertInfo(result?.message!)
  }

  const acceptFriendRequest = (result: NotifyResponseType) => {
    addNewFriend({
      senderId: result.senderId,
      recipientId: result.recipientId!
    }, dispatch)
    AlertInfo(result.message!)
  }

  const sendCall = (result: NotifyResponseType) => {
    setShowVideoCallScreen(true, dispatch)
    setStatusCall(StatusCallType.INCOMING_CALL, dispatch)
    setDataVideoCall(result, dispatch)
  }

  const acceptCall = (result: NotifyResponseType) => {
    setShowVideoCallScreen(false, dispatch)
    setStatusCall(StatusCallType.CALLED, dispatch)
    setDataVideoCall(result, dispatch)
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
          appState.currentSidebar === SidebarType.FRIEND_REQUEST ? <SidebarFriendRequest /> : null
        }

        {
          appState.currentSidebar === SidebarType.PROFILE ? <SidebarProfile /> : null
        }

        {
          currentChatRoomId ? <>
            <ChatScreen 
            chat={chatState.listChat[currentIndexChat]} 
            messages={chatState.listChat[currentIndexChat].messages!} />
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
