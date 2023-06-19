import { auth, db, onMessageListener, storage } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "../Message/Message";
import { useEffect, useRef, useState } from "react";
import getRecipientEmail from "@/utils/getRecipientEmail";
import { useRouter } from "next/router";
import firebase from "firebase";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import { IconButton, Modal } from "@mui/material";
import {getEmojiData} from "@/utils/getEmojiData";
import sendNotificationFCM from "@/utils/sendNotificationFCM";
import SendIcon from "@mui/icons-material/Send";
import Loading from "@/components/Loading";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import UserDetailScreen from "@/components/ProfilePage/UserDetailScreen/UserDetailScreen";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
  EmojiContainer,
  EmojiElement,
  EndOfMessage,
  InputMessage,
} from "./ChatScreenStyled";
import { toast } from "react-toastify";
import {
  addMessageToFirebase,
  handleImageInMessage,
  pushUrlImageToFirestore,
  sendNotification,
  setSeenMessage,
} from "../Functions";
import { useSelector, useDispatch } from 'react-redux';
import { addNewMessage, pushMessageToListChat, selectAppState, setListChat, setStatusSend } from "@/redux/appSlice";
import { ChatType } from "@/types/ChatType";
import { MapMessageData, MessageType } from "@/types/MessageType";
import Image from "next/image";
import EmojiContainerComponent from "@/components/EmojiContainerComponent";
import useComponentVisible from "@/hooks/useComponentVisible";
import styled from "styled-components";
import { getImageTypeFileValid } from "@/utils/getImageTypeFileValid";
import DropdownAttach from "@/components/DropdownAttach";
import { v4 as uuidv4 } from 'uuid'

const getMessage = async (id: string) => {
  const snap = await db
    .collection("chats")
    .doc(id)
    .collection("messages")
    .orderBy("timestamp")
    .get();
  return snap;
};

export default function ChatScreen({ chat, messages }: { chat: ChatType, messages: Array<MessageType> }) {
  const [user] = useAuthState(auth);
  const endOfMessageRef: any = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const dispatch = useDispatch()
  const appState = useSelector(selectAppState)

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  const getNewMessage = async() => {
    const doc = await db.collection("chats").doc(chat.id).collection("messages").orderBy("timestamp").limitToLast(1).get()
    return MapMessageData(doc?.docs?.[0])
  }

  useEffect(() => {
    onMessageListener()
      .then(() => {
        getNewMessage().then((newMsg) => {
          if (!appState.currentMessages?.find((msg) => msg.id === newMsg.id)) {
            dispatch(addNewMessage(newMsg))
            dispatch(pushMessageToListChat({ chat: chat, newMessage: newMsg }))
          }
        }).catch(err => console.log(err))
      })
      .catch((err) => console.log(err));
  },[]);

  useEffect(() => {
    const channel = new BroadcastChannel("notifications");
      channel.addEventListener("message", () => {
        getNewMessage().then((newMsg) => {
          if (!appState.currentMessages?.find((msg) => msg.id === newMsg.id)) {
            dispatch(addNewMessage(newMsg))
            dispatch(pushMessageToListChat({ chat: chat, newMessage: newMsg }))
          }
        }).catch(err => console.log(err))
    });
  },[]);

  useEffect(() => {
    // getRecipientUser().catch((err) => console.log(err))

    scrollToBottom();

    // socket.on('response-reject-call-one-to-one', (res: string) => {
    //     let data = JSON.parse(res);
    //     if(data.recipient === user?.email) {
    //         setIsOpen(false);
    //         // toast(`${data.name} rejected the call !`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
    //     }
    // });

    // socket.on("response-accept-call-one-to-one", (res: string) => {
    //     let data = JSON.parse(res);
    //     console.log(data.sender === user?.email)
    //     if(data.sender === user?.email) {
    //         setIsOpen(false);
    //         window.open(router.basePath + "/video-call/" + data.chat.id);
    //     }
    // })

    // return () => {
    //     socket.disconnect()
    // }
  }, [messages]);

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const getRecipientAvatar = () => {
    if (chat?.isGroup) {
      if (chat?.photoURL.length > 0) return chat?.photoURL;
      else return "/images/group-default.jpg";
    } else {
      let photoUrl = recipientSnapshot?.docs?.[0].data().photoURL;
      if (photoUrl?.length > 0) return photoUrl;
      else return "/images/avatar-default.png";
    }
  };

  const showMessage = () => {
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
  };

  const sendMessage = async (e: any): Promise<any> => {
    dispatch(setStatusSend(1))
    e.preventDefault();

    let { listElementImg, message } = handleImageInMessage();

    setSeenMessage(messages, user?.email, chat.id);

    const { messageDoc } = await addMessageToFirebase(
      message,
      Object.keys(listElementImg).length > 0 ? "text-image" : "text",
      user?.email,
      chat.id
    );

    if (messageDoc) {
      const snap = await messageDoc.get();
      console.log(listElementImg)
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
      sendNotification(
        snap,
        chat,
        user?.displayName,
        recipientSnapshot?.docs?.[0]?.data().fcm_token
      );
      dispatch(addNewMessage(MapMessageData(snap)))
      dispatch(pushMessageToListChat({ chat: chat, newMessage: MapMessageData(snap) }))
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
    dispatch(setStatusSend(2))
  };

  const onSendMessage = (msg: string) => {
    
  }

  // const handleVideoCall = async() => {
  //     let userBusy = await getUserBusy();

  //     if(!isOpen) {

  //         if(userBusy.includes(recipientUser.email)) {

  //             toast(`${recipientUser.fullName} is busy`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
  //             return;

  //         } else {

  //             setIsOpen(true);
  //             // let listRecipient = chat.users.filter((email: any) => email !== user?.email);
  //             let data = {
  //                 sender: user?.email,
  //                 recipient: getRecipientEmail(chat.users, user),
  //                 chat.id: chat.id,
  //                 isGroup: chat.isGroup
  //             }
  //             socket.emit("call-video-one-to-one", JSON.stringify(data));
  //         }
  //     }

  //     return null;
  // }

  const addEmoji = (e: number) => {
    const inputMess = document.getElementById("input-message")?.innerHTML;
    document.getElementById("input-message")!.innerHTML =
      inputMess + String.fromCodePoint(e);
    setShowEmoji(false);
  };

  setSeenMessage(messages, user?.email, chat.id);
  
  const handleGroupOnline = (): boolean => {
    let amountUserOnline = 0;
    chat.users.forEach((userChat: string) => {
      if(appState.userOnline?.find((u: string) => u === userChat && u !== user?.email)?.length! > 0 && user !== user?.email) {
        amountUserOnline++
      }
    })
    return amountUserOnline > 0;
  }

  const handleShowAvatarOnline = () => {
    if (chat.isGroup) {
      if (handleGroupOnline()) {
        return <div className="border-white w-3 h-3 absolute right-0 top-0 rounded-full border-2" style={{background: 'green'}}></div>
      } else {
        return <div className="border-white w-3 h-3 absolute right-0 top-0 rounded-full border-2" style={{background: 'gray'}}></div>
      }
    } else {
      if (appState.userOnline?.find((u: any) => u === recipientSnapshot?.docs?.[0]?.data().email)) {
        return <div className="border-white w-3 h-3 absolute right-0 top-0 rounded-full border-2" style={{background: 'green'}}></div>
      } else {
        return <div className="border-white w-3 h-3 absolute right-0 top-0 rounded-full border-2" style={{background: 'gray'}}></div>
      }
    }
  }

  const handleShowTextOnline = () => {
    if (chat.isGroup) {
      if (handleGroupOnline()) {
        return "Online"
      } else {
        return "Offline"
      }
    } else {
      if (appState.userOnline?.find((u: any) => u === recipientSnapshot?.docs?.[0]?.data().email)) {
        return "Online"
      } else {
        return "Offline"
      }
    }
  }

  return (
    //     <VideoCallContainer isOpen={isOpen} >
    //         <VideoCallScreen statusCall='Calling' photoURL={chat.isGroup ? chat.photoURL : recipientUser.photoURL} sender={user?.email} recipient={getRecipientEmail(chat.users, user)} chat.id={chat.id} onClose={() => setIsOpen(false)} isGroup={chat.isGroup} />
    //     </VideoCallContainer>
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
              {handleShowAvatarOnline()}
            </div>
            <div className="ml-2 overflow-hidden">
              <a href="javascript:void(0)" className="text-base font-medium">{ chat.isGroup ? "Group: " + chat.name : recipientSnapshot?.docs?.[0].data().fullName}</a>
              <div className="text-gray-600">
              {handleShowTextOnline()}
              </div>
            </div>
          </div>
          <a className="text-gray-600 hover:text-theme-1" href=""> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-camera w-4 h-4 sm:w-6 sm:h-6"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> </a>
          <a className="text-gray-600 hover:text-theme-1 ml-2 sm:ml-5" href=""> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mic w-4 h-4 sm:w-6 sm:h-6"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg> </a>
        </div>

        <ScrollBarCustom className="overflow-y-auto pt-5 flex-1 px-4">

        {showMessage()}
        <EndOfMessage ref={endOfMessageRef} /> 

        </ScrollBarCustom>

        <div className="intro-y chat-input box border-theme-3 dark:bg-dark-2 dark:border-dark-2 border flex items-center px-5 py-4">
        <DropdownAttach chatId={chat.id} scrollToBottom={scrollToBottom} recipient={recipientSnapshot?.docs?.[0]} />
        <InputMessage
          contentEditable="true"
          className="w-full block outline-none py-4 px-4 bg-transparent"
          onClick={() => setSeenMessage}
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
        {
          showEmoji ?  <EmojiContainerComponent onAddEmoji={(emoji: number) => addEmoji(emoji)} /> : null
        }
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
      </div>
    </>
  );
}



const ScrollBarCustom = styled.div`
  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 8px;
    background-color: #e7e7e7;
    border: 1px solid #cacaca;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: rgb(197,197,197);
  }
`
