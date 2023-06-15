import { auth, db, storage } from "@/firebase";
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
  pushUrlFileToFirestore,
  pushUrlImageToFirestore,
  sendNotification,
  setSeenMessage,
} from "../Functions";
import { useSelector, useDispatch } from 'react-redux';
import { selectAppState, setChatData } from "@/redux/appSlice";
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
  const [isLoading, setLoading] = useState(false);
  const [statusSend, setStatusSend] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [messData,setMessData] = useState(messages)
  // const { data, status } = useQuery("getMessData", getMessage(chat.id))
  const dispatch = useDispatch()
  const appState = useSelector(selectAppState)

  const [messageSnapShot] = useCollection(
    db
      .collection("chats")
      .doc(chat.id)
      .collection("messages")
      .orderBy("timestamp")
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  

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
    // if (messageSnapShot) {
    //   return messageSnapShot?.docs?.map((message, index) => (
    //     <Message
    //       key={message?.id}
    //       message={MapMessageData(message)}
    //       timestamp={message?.data()?.timestamp?.toDate()}
    //       photoURL={getRecipientAvatar()}
    //       chat.id={chat.id}
    //       showAvatar={messageSnapShot?.docs[index]?.data()?.user !== messageSnapShot?.docs[index+1]?.data()?.user ? message.id : null}
    //     />
    //   ));
    // } else {
      return messages?.map((message: MessageType, index) => (
        <Message
          key={message.id}
          message={message}
          timestamp={message.timestamp.toDate()}
          photoURL={getRecipientAvatar()}
          chatId={chat.id}
          showAvatar={messages[index]?.user !== messages[index+1]?.user ? message.id : null}
        />
      ));
    // }
  };

  const sendMessage = async (e: any): Promise<any> => {
    setStatusSend("Sending...");
    e.preventDefault();

    let { listElementImg, message } = handleImageInMessage();

    setSeenMessage(messages, user?.email, chat.id);

    const { messageDoc } = await addMessageToFirebase(
      message,
      listElementImg?.length > 0 ? "text-image" : "text",
      user?.email,
      chat.id
    );

    if (messageDoc) {
      const snap = await messageDoc.get();
      for(const key of Object.keys(listElementImg)) {
            const response = await fetch(listElementImg[key].src);
            const blob = await response.blob();
            let path = `public/images/chat-room/${chat.id}/${key}`
            storage
              .ref(key)
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
      dispatch(setChatData({
        ...appState.chatData,
        messages: [...appState.chatData.messages!, MapMessageData(snap)]
      }))
    }

    const element = document.getElementById("input-message");
    if (element) element.innerHTML = "";

    scrollToBottom();
    setStatusSend("Sent");
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
      {/* <Loading isShow={isLoading} />
      <div className="chat-area flex-1 flex flex-col relative">
        <div className="flex-3">
          <h2 className="text-xl pb-1 mb-4 border-b-2 border-gray-200 d-flex">
            {chat.isGroup ? "Chatting in group " : "Chatting with "}&nbsp;
            {!chat.isGroup ? (
              <div
                onClick={() => setIsOpen(true)}
                className="cursor-pointer font-semibold"
                id="hover-animation"
                data-replace="Profile"
              >
                <span>{recipientSnapshot?.docs?.[0].data().fullName}</span>
              </div>
            ) : (
              <span>{chat.name}</span>
            )}
            <div className="ml-auto">
              <IconButton>
                <VideocamIcon fontSize="small" />
              </IconButton>
              <IconButton>
                <CallIcon fontSize="small" />
              </IconButton>
            </div>
          </h2>
        </div>
        <div className="messages flex-1 overflow-auto h-screen px-4">
          {showMessage()}
          {statusSend.length > 0 ? (
            <span className="float-right pr-2">
              {statusSend}
              &nbsp;
              {statusSend === "Sending..." ? null : (
                <DoneAllIcon fontSize="small" />
              )}
            </span>
          ) : null}
          <EndOfMessage
            ref={(el) => {
              endOfMessageRef.current = el;
            }}
          />
        </div>
        <div className="pt-4 pb-10">
          <div className="write bg-white shadow flex rounded-lg">
            <div
              className="text-center pt-4 pl-4 cursor-pointer"
              onClick={() => setShowEmoji(!showEmoji)}
            >
              <span className="text-gray-400 hover:text-gray-800">
                <span className="align-text-bottom">
                  <TagFacesIcon fontSize="small" />
                </span>
              </span>
            </div>
            <div className="flex-1">
              <InputMessage
                contentEditable="true"
                className="w-full block outline-none py-4 px-4 bg-transparent"
                style={{ maxHeight: "160px" }}
                onClick={() => setSeenMessage}
                id="input-message"
                placeholder="Type message..."
              />
            </div>

            <div className="p-2 flex content-center items-center">
              <div
                className="text-center p-2 cursor-pointer"
                onClick={() => sendMessage}
              >
                <span className="text-gray-400 hover:text-gray-800">
                  <span className="align-text-bottom">
                    <input
                      type="file"
                      hidden
                      id="upload-image"
                      onChange={onImageChange}
                      multiple
                    />
                    <InsertPhotoIcon
                      fontSize="small"
                      onClick={() =>
                        document.getElementById("upload-image")?.click()
                      }
                    />
                  </span>
                </span>
              </div>
              <div
                className="text-center p-2 cursor-pointer"
                onClick={() => sendMessage}
              >
                <span className="text-gray-400 hover:text-gray-800">
                  <span className="align-text-bottom">
                    <input
                      type="file"
                      hidden
                      id="upload-file"
                      onChange={onAttachFile}
                    />
                    <AttachFileIcon
                      fontSize="small"
                      onClick={() =>
                        document.getElementById("upload-file")?.click()
                      }
                    />
                  </span>
                </span>
              </div>
              <div className="text-center cursor-pointer p-2">
                <span
                  className="text-indigo-500 hover:text-gray-800"
                  onClick={(event) => sendMessage(event)}
                >
                  <span className="align-text-bottom">
                    <SendIcon />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        {showEmoji ? (
          <EmojiContainer>
            {getEmojiData.map((e: any) => (
              <EmojiElement onClick={() => addEmoji(e)} key={e}>
                {String.fromCodePoint(e)}
              </EmojiElement>
            ))}
          </EmojiContainer>
        ) : null}
      </div>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <UserDetailScreen userInfo={recipientSnapshot?.docs?.[0].data()} />
      </Modal> */}
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
              <a href="javascript:;" className="text-base font-medium">{ chat.isGroup ? "Group: " + chat.name : recipientSnapshot?.docs?.[0].data().fullName}</a>
              <div className="text-gray-600">
              {handleShowTextOnline()}
              </div>
            </div>
          </div>
          <a className="text-gray-600 hover:text-theme-1" href=""> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-camera w-4 h-4 sm:w-6 sm:h-6"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> </a>
          <a className="text-gray-600 hover:text-theme-1 ml-2 sm:ml-5" href=""> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-mic w-4 h-4 sm:w-6 sm:h-6"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg> </a>
        </div>
        <ScrollBarCustom className="overflow-y-scroll pt-5 flex-1 px-4">
        {showMessage()}
        {/* <div className="-intro-x chat-text-box flex items-end float-left mb-4">
        <div className="chat-text-box__photo w-10 h-10 hidden sm:block flex-none image-fit relative mr-4">
        <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-full" src="https://topson.left4code.com/dist/images/profile-9.jpg"/>
        </div>
        <div className="w-full">
        <div>
        <div className="chat-text-box__content flex items-center float-left">
        <div className="box leading-relaxed dark:text-gray-300 text-gray-700 px-4 py-3 mt-3"> Lorem ipsum sit amen dolor, lorem ipsum sit amen dolor </div>
        <div className="hidden sm:block dropdown relative ml-3 mt-3">
        <a href="javascript:;" className="dropdown-toggle w-4 h-4"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </a>
        <div className="dropdown-menu w-40">
        <div className="dropdown-menu__content box dark:bg-dark-1 p-2">
        <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-corner-up-left w-4 h-4 mr-2"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg> Reply </a>
        <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-trash w-4 h-4 mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete </a>
        </div>
        </div>
        </div>
        </div>
        <div className="clear-both"></div>
        <div className="chat-text-box__content flex items-center float-left">
        <div className="rounded-md text-gray-700 chat-text-box__content__text--image flex justify-end mt-3">
        <div className="tooltip w-16 h-16 image-fit zoom-in">
        <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-md" src="https://topson.left4code.com/dist/images/preview-4.jpg"/>
        </div>
        <div className="tooltip w-16 h-16 image-fit ml-2 zoom-in">
        <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-md" src="https://topson.left4code.com/dist/images/preview-12.jpg"/>
        </div>
        </div>
        <div className="hidden sm:block dropdown relative ml-3 mt-3">
        <a href="javascript:;" className="dropdown-toggle w-4 h-4"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </a>
        <div className="dropdown-menu w-40">
        <div className="dropdown-menu__content box dark:bg-dark-1 p-2">
        <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-corner-up-left w-4 h-4 mr-2"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg> Reply </a>
        <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-trash w-4 h-4 mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete </a>
        </div>
        </div>
        </div>
        </div>
        <div className="clear-both"></div>
        <div className="chat-text-box__content flex items-center float-left">
        <div className="box leading-relaxed dark:text-gray-300 text-gray-700 px-4 py-3 mt-3"> Contrary to popular belief </div>
        <div className="hidden sm:block dropdown relative ml-3 mt-3">
        <a href="javascript:;" className="dropdown-toggle w-4 h-4"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </a>
        <div className="dropdown-menu w-40">
        <div className="dropdown-menu__content box dark:bg-dark-1 p-2">
        <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-corner-up-left w-4 h-4 mr-2"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg> Reply </a>
        <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-trash w-4 h-4 mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete </a>
        </div>
        </div>
        </div>
        </div>
        </div>
        <div className="clear-both mb-2"></div>
        <div className="text-gray-600 text-xs">10 secs ago</div>
        </div>
        </div>
        <div className="clear-both"></div> */}
        {/* <div className="intro-x chat-text-box flex items-end float-right mb-4">
        <div className="w-full">
        <div>
        <div className="chat-text-box__content flex items-center float-right">
        <div className="hidden sm:block dropdown relative mr-3 mt-3">
        <a href="javascript:;" className="dropdown-toggle w-4 h-4"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </a>
        <div className="dropdown-menu w-40">
        <div className="dropdown-menu__content box dark:bg-dark-1 p-2">
        <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-corner-up-left w-4 h-4 mr-2"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg> Reply </a>
        <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-trash w-4 h-4 mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete </a>
        </div>
        </div>
        </div>
        <div className="box leading-relaxed text-gray-700 dark:text-gray-300 flex flex-col sm:flex-row items-center mt-3 p-3">
        <div className="chat-text-box__content__icon text-white w-12 flex-none bg-contain relative bg-no-repeat bg-center block">
        <div className="absolute m-auto top-0 left-0 right-0 bottom-0 flex items-center justify-center">PNG</div>
        </div>
        <div className="sm:ml-3 mt-3 sm:mt-0 text-center sm:text-left">
        <div className="text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium">preview-10.jpg</div>
        <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">1.4 MB Image File</div>
        </div>
        <div className="sm:ml-20 mt-3 sm:mt-0 flex">
        <a href="javascript:;" className="tooltip w-8 h-8 block border rounded-full flex-none flex items-center justify-center ml-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-download w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> </a>
        <a href="javascript:;" className="tooltip w-8 h-8 block border rounded-full flex-none flex items-center justify-center ml-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-share w-4 h-4"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg> </a>
        <a href="javascript:;" className="tooltip w-8 h-8 block border rounded-full flex-none flex items-center justify-center ml-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-horizontal w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg> </a>
        </div>
        </div>
        </div>
        </div>
        <div className="clear-both mb-2"></div>
        <div className="text-gray-600 text-xs text-right">1 secs ago</div>
        </div>
        <div className="chat-text-box__photo w-10 h-10 hidden sm:block flex-none image-fit relative ml-4">
        <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-full" src="https://topson.left4code.com/dist/images/profile-1.jpg"/>
        </div>
        </div>
        <div className="clear-both"></div> */}
        {/* <div className="-intro-x chat-text-box flex items-end float-left mb-4">
        <div className="w-10 h-10 hidden sm:block flex-none image-fit relative mr-5">
        <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-full" src="https://topson.left4code.com/dist/images/profile-9.jpg"/>
        </div>
        <div className="w-full">
        <div>
        <div className="chat-text-box__content flex items-center float-left">
        <div className="box leading-relaxed dark:text-gray-300 text-gray-700 px-4 py-3 mt-3">
        John Travolta is typing
        <span className="typing-dots ml-1"> <span>.</span> <span>.</span> <span>.</span> </span>
        </div>
        </div>
        </div>
        </div>
        </div> */}
        <EndOfMessage ref={endOfMessageRef} /> 
        </ScrollBarCustom>
        <div className="intro-y chat-input box border-theme-3 dark:bg-dark-2 dark:border-dark-2 border flex items-center px-5 py-4">
        <DropdownAttach chatId={chat.id} scrollToBottom={scrollToBottom} />
        <InputMessage
          contentEditable="true"
          className="w-full block outline-none py-4 px-4 bg-transparent"
          onClick={() => setSeenMessage}
          id="input-message"
        />
        
        <div className="dropdown relative mr-3 sm:mr-5">
        <a href="javascript:;" className="text-gray-600 hover:text-theme-1 dropdown-toggle w-4 h-4 sm:w-5 sm:h-5 block" onClick={() => setShowEmoji(!showEmoji)}> 
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-smile w-full h-full">
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
        href="javascript:;" 
        className="bg-theme-1 text-white w-8 h-8 sm:w-10 sm:h-10 block rounded-full flex-none flex items-center justify-center"
        onClick={(event) => sendMessage(event)}> 
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-send w-4 h-4 sm:w-5 sm:h-5">
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
