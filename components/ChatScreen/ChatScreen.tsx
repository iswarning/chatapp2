import { auth, db, storage } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message/Message";
import { useEffect, useRef, useState } from "react";
import getRecipientEmail from "@/utils/getRecipientEmail";
import { useRouter } from "next/router";
import {
  EndOfMessage,
  InputMessage,
} from "./ChatScreenStyled";
import { toast } from "react-toastify";
import {
  addMessageToFirebase,
  handleImageInMessage,
  pushUrlImageToFirestore
} from "./Functions";
import { useSelector, useDispatch } from 'react-redux';
import { StatusCallType, selectAppState, setDataVideoCall, setShowVideoCallScreen, setStatusCall } from "@/redux/appSlice";
import { ChatType } from "@/types/ChatType";
import { MapMessageData, MessageType } from "@/types/MessageType";
import Image from "next/image";
import EmojiContainerComponent from "@/components/ChatScreen/EmojiContainerComponent";
import styled from "styled-components";
import DropdownAttach from "@/components/ChatScreen/DropdownAttach";
import CallIcon from '@mui/icons-material/Call';
import { io } from "socket.io-client";
import getUserBusy from "@/utils/getUserBusy";
import sendNotificationFCM from "@/utils/sendNotificationFCM";
import { MapUserData } from "@/types/UserType";
import { requestMedia } from "@/utils/requestPermission";

export default function ChatScreen({ chat, messages }: { chat: ChatType, messages: Array<MessageType> }) {
  const [user] = useAuthState(auth);
  const endOfMessageRef: any = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [progress, setProgress] = useState(0);
  const dispatch = useDispatch()
  const appState = useSelector(selectAppState)

  const [messageSnapshot] = useCollection(
    db
    .collection("chats")
    .doc(chat.id)
    .collection("messages")
    .orderBy("timestamp")
  )

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  const recipientInfo = MapUserData(recipientSnapshot?.docs?.[0]!)

  useEffect(() => {
    scrollToBottom();
  }, [messageSnapshot, messages]);

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const getRecipientAvatar = () => {
    if (chat?.isGroup) {
      if (chat?.photoURL.length > 0) return chat?.photoURL;
      else return "/images/group-default.jpg";
    } else {
      let photoUrl = recipientInfo.photoURL;
      if (photoUrl?.length > 0) return photoUrl;
      else return "/images/avatar-default.png";
    }
  };

  const showMessage = () => {
      if (messageSnapshot) {
        return messageSnapshot.docs?.map((message, index) => (
          <Message
            key={message.id}
            message={MapMessageData(message)}
            timestamp={message.data().timestamp}
            chatId={chat.id}
            lastIndex={messages[index] === messages[messages.length - 1]}
            scrollToBottom={() => scrollToBottom()}
          />
        ));
      } else {
        return messages?.map((message: MessageType, index) => (
          <Message
            key={message.id}
            message={message}
            timestamp={message.timestamp}
            chatId={chat.id}
            lastIndex={messages[index] === messages[messages.length - 1]}
            scrollToBottom={() => scrollToBottom()}
          />
        ));
      }
  };

  const sendMessage = async (e: any): Promise<any> => {
    e.preventDefault();

    let { listElementImg, message } = handleImageInMessage();

    const { messageDoc } = await addMessageToFirebase(
      message,
      Object.keys(listElementImg).length > 0 ? "text-image" : "text",
      user?.email,
      chat.id
    );

    if (messageDoc) {
      const snap = await messageDoc.get();
      if (Object.keys(listElementImg).length > 0) {
        for(const key of Object.keys(listElementImg)) {
            const response = await fetch(listElementImg[key].src);
            const blob = await response.blob();
            let path = `public/chat-room/${chat.id}/photos/${key}`
            storage
              .ref(path)
              .put(blob)
              .on(
                "state_changed",
                (snapshot) => {
                  const prog = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  );
                  setProgress(prog);
                },
                (err) => console.log(err),
                () => {
                  pushUrlImageToFirestore(
                    snap.id,
                    chat.id,
                    scrollToBottom,
                    key,
                    path
                  );
                }
              );
        }
      }
      if (chat.isGroup) {
        for(const email of chat.users.filter((email) => email !== user?.email)) {
          let userInfo = await db.collection("users").where("email",'==',email).limit(1).get()
          sendNotificationFCM(
            "New message !", 
            "New message from " + chat.name, 
            userInfo?.docs?.[0].data().fcm_token
          )
        }
      } else {
        sendNotificationFCM(
          "New message !", 
          "New message from " + user?.displayName,
          recipientInfo.fcm_token
        )
      }
    } else {
      toast("Error when send message !", {
        hideProgressBar: true,
        type: "error",
        autoClose: 5000,
      });
      const element = document.getElementById("input-message");
      if (element) element.innerHTML = "";
      return
    }

    const element = document.getElementById("input-message");
    if (element) element.innerHTML = "";

    scrollToBottom();
  };

  const addEmoji = (e: number) => {
    const inputMess = document.getElementById("input-message")?.innerHTML;
    document.getElementById("input-message")!.innerHTML =
      inputMess + String.fromCodePoint(e);
    setShowEmoji(false);
  };

  const handleCalling = async(chatInfo: any = chat ,  userInfo: any = recipientInfo) => {
    
    

    let userBusy = await getUserBusy();

    if(!appState.showVideoCallScreen) {

        if(userBusy.includes(userInfo.email) || !appState.userOnline.find((userOn) => userInfo.email === userOn)) {

            toast(`${userInfo.fullName} is busy`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
            return;

        } else {

            const checkPermission = await requestMedia()

            if (!checkPermission) {
              toast(`Please allow using camera and microphone`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
              return;
            }

            dispatch(setShowVideoCallScreen(true))
            dispatch(setStatusCall(StatusCallType.CALLING));
            let data = {
                sender: user?.email,
                recipient: userInfo.email,
                chatId: chatInfo.id,
                isGroup: chatInfo.isGroup,
                photoURL: userInfo.photoURL,
            }
            dispatch(setDataVideoCall(data))
            appState.socket.emit("call-video-one-to-one", JSON.stringify(data));
        }
    }
  }

  return (
    <>
      <div className="chat-box border-theme-5 col-span-12 xl:col-span-6 flex flex-col overflow-hidden xl:border-l xl:border-r p-6">
        <div className="intro-y box border border-theme-3 dark:bg-dark-2 dark:border-dark-2 flex items-center px-5 py-4">
          <div className="flex items-center mr-auto">
            <div className="w-12 h-12 flex-none image-fit mr-1">
              <Image 
                src={getRecipientAvatar()}
                width={48}
                height={48}
                alt=""
                className="rounded-full"
              />
            </div>
            <div className="ml-2 overflow-hidden">
              <a href="javascript:void(0)" className="text-base font-medium">{ chat.isGroup ? "Group: " + chat.name : recipientInfo.fullName}</a>
            </div>
          </div>
          <a className="text-gray-600 hover:text-theme-1" href="javascript:void(0)" onClick={handleCalling}> 
            <CallIcon fontSize="small" />
           </a>
        </div>

        <ScrollBarCustom className="overflow-y-auto pt-5 flex-1 px-4">

        {showMessage()}
        <EndOfMessage ref={endOfMessageRef} /> 

        </ScrollBarCustom>

        <div className="intro-y chat-input box border-theme-3 dark:bg-dark-2 dark:border-dark-2 border flex items-center px-5 py-4">
        <DropdownAttach chatId={chat.id} scrollToBottom={scrollToBottom} recipient={recipientSnapshot?.docs?.[0]} setProgress={(prog: any) => setProgress(prog)} />
        <InputMessage
          contentEditable="true"
          className="w-full block outline-none py-4 px-4 bg-transparent"
          style={{overflowY: 'auto'}}
          id="input-message"
        />
        
        <div className="dropdown relative mr-3 sm:mr-5">
        <a href="javascript:void(0)" className="text-gray-600 hover:text-theme-1 w-4 h-4 sm:w-5 sm:h-5 block" onClick={() => setShowEmoji(!showEmoji)}> 
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-smile w-full h-full">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg> 
        </a>
        
        </div>
        <a 
        href="javascript:void(0)" 
        className="bg-theme-1 text-white w-8 h-8 sm:w-10 sm:h-10 block rounded-full flex-none flex items-center justify-center"
        onClick={sendMessage}> 
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-send w-4 h-4 sm:w-5 sm:h-5">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg> 
        </a>
        </div>
        {/* {
          progress > 0 && progress < 100 ? <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
            <div className="text-xs font-medium text-center p-0.5 leading-none rounded-full" style={{width: `${progress}%`, background: '#6775F5', color: 'white', height: '15px'}}>{progress}%</div>
          </div> : null
        } */}
      </div>
      {
        showEmoji ?  <EmojiContainerComponent onAddEmoji={(emoji: number) => addEmoji(emoji)} /> : null
      }
    </>
  );
}



const ScrollBarCustom = styled.div`
  &::-webkit-scrollbar-thumb {
    background-color: #d6dee1;
    border-radius: 20px;
    border: 6px solid transparent;
    background-clip: content-box;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar {
    width: 20px;
  }
`
