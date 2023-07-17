import { auth, db, storage } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Message from "./Message/Message";
import { useEffect, useRef, useState } from "react";
import {
  EndOfMessage,
  InputMessage,
} from "./ChatScreenStyled";
import { toast } from "react-toastify";
import {
  handleImageInMessage,
} from "./Functions";
import { useSelector, useDispatch } from 'react-redux';
import { StatusSendType, selectAppState } from "@/redux/appSlice";
import { ChatType } from "@/types/ChatType";
import { MessageType } from "@/types/MessageType";
import Image from "next/image";
import EmojiContainerComponent from "@/components/ChatScreen/EmojiContainerComponent";
import styled from "styled-components";
import DropdownAttach from "@/components/ChatScreen/DropdownAttach";
import CallIcon from '@mui/icons-material/Call';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import getUserBusy from "@/utils/getUserBusy";
import { requestMedia } from "@/utils/requestPermission";
import { StatusCallType, selectVideoCallState, setGlobalVideoCallState } from "@/redux/videoCallSlice";
import {v4 as uuidv4} from 'uuid'
import { addPrepareImage, pushMessageToListChat, setCurrentChat, setShowGroupInfo, setStatusSend } from "@/services/CacheService";
import { AlertError } from "@/utils/core";
import { createMessage } from "@/services/MessageService";
import PrepareSendImageScreen from "./PrepareSendImageScreen";


export default function ChatScreen({ chat, messages }: { chat: ChatType, messages: Array<MessageType> }) {
  const [user] = useAuthState(auth);
  const endOfMessageRef: any = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const dispatch = useDispatch()
  const appState = useSelector(selectAppState)
  const videoCallState = useSelector(selectVideoCallState)
  const [input, setInput] = useState("")

  // const [recipientSnapshot] = useCollection(
  //   db
  //     .collection("users")
  //     .where("email", "==", getRecipientEmail(chat.users, user))
  // );

  // const recipientInfo = MapUserData(recipientSnapshot?.docs?.[0]!)

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const getRecipientAvatar = () => {
    if (chat?.isGroup) {
      if (chat?.photoURL!.length > 0) return chat?.photoURL;
      else return "/images/group-default.jpg";
    } else {
      let photoUrl = chat?.recipientInfo?.photoURL;
      if (photoUrl?.length! > 0) return photoUrl;
      else return "/images/avatar-default.png";
    }
  };

  const showMessage = () => {
    return messages?.map((message: MessageType, index) => (
      <Message
        key={message._id}
        message={message}
        timestamp={""}
        chatId={chat._id!}
        lastIndex={messages[index] === messages[messages.length - 1]}
        scrollToBottom={() => scrollToBottom()}
      />
    ));
  };

  const sendMessage = (e: any) => {
    setStatusSend(StatusSendType.SENDING, dispatch)
    e.preventDefault();

    let newMessage = {} as MessageType
    newMessage._id = uuidv4()
    newMessage.message = input
    newMessage.createdAt = new Date().toLocaleString()
    newMessage.senderId = appState.userInfo._id!
    newMessage.type = "text"

    pushMessageToListChat(chat._id!, newMessage, dispatch)

    setCurrentChat({
      ...chat,
      messages: [
        ...chat.messages!,
        newMessage
      ]
    }, dispatch)

    createMessage({
      chatRoomId: chat._id,
      message: newMessage.message,
      senderId: newMessage.senderId,
      type: newMessage.type
    })
    .then((data: MessageType) => {
      appState.socket.emit("send-notify", JSON.stringify(
        { 
          recipient: chat.members.filter((u) => appState.userInfo._id !== u), 
          message: `${chat.isGroup ? chat.name : user?.displayName}: ${data.message}`,
          type: "send-message",
          data: JSON.stringify(data)
        }
      ))
    })
    .catch(err => {
      setStatusSend(StatusSendType.ERROR, dispatch)
      AlertError("Error when send message !")
      console.log(err)
    })
    .finally(() => {
      setStatusSend(StatusSendType.SENT, dispatch)
      scrollToBottom();
    })

    setInput("")

  };

  const addEmoji = (e: number) => {
    setInput(input + + String.fromCodePoint(e))
    setShowEmoji(false);
  };

  const handleCalling = async(chatInfo: any = chat ,  userInfo: any = chat.recipientInfo) => {

    let userBusy = await getUserBusy();

    if(!videoCallState.showVideoCallScreen) {

        if(userBusy.includes(userInfo.email) || !appState.userOnline.find((userOn) => userInfo.email === userOn)) {

            toast(`${userInfo.fullName} is busy`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
            return;

        } else {

            const checkPermission = await requestMedia()

            if (!checkPermission) {
              toast(`Please allow using camera and microphone`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
              return;
            }

            dispatch(setGlobalVideoCallState({
              type: "setShowVideoCallScreen",
              data: true
            }))
            dispatch(setGlobalVideoCallState({
              type: "setStatusCall",
              data: StatusCallType.CALLING
            }));
            let data = {
                sender: user?.email,
                recipient: userInfo.email,
                chatId: chatInfo._id,
                isGroup: chatInfo.isGroup,
                photoURL: userInfo.photoURL,
            }
            dispatch(setGlobalVideoCallState({
              type: "setDataVideoCall",
              data: data
            }))
            appState.socket.emit("call-video-one-to-one", JSON.stringify(data));
        }
    }
  }

  const handlePaste = (files: any) => {
    if (appState.prepareImages.length >= 5) {
      AlertError("Maximum image attach !")
      return;
    } 
    if(files) {
      let fileSize = files[0].size
      if (FileReader) {
        let fr = new FileReader();
        fr.onload = function () {
          if(appState.prepareImages.length > 0 && appState.prepareImages.find((image) => image.size === fileSize)) return
          addPrepareImage({
            size: fileSize,
            url: fr.result
          },dispatch)
        }
        fr.readAsDataURL(files[0]);
     }
    }
  }

  const handleDragFile = (data: any) => {
    if(data?.items) {
      const valid = 
      // the "accept" value was not supplied
      !accept ||
      // the "accept" value was a wild card
      accept === "*/*" ||
      accept === "*" ||
      // the "dataTransfer.items" is not iterable in older ES versions
      // therefore, we need to convert it into an Array
      // Thankfully since it has a "length" property, we can use Array.from
      Array
          .from(e.dataTransfer.items)
          // every item must return "true"
          .every(item => {
              const { kind, type } = item;
              if (kind === "file") {
                  // the type is */* format
                  const [ namespace, friendlyName ] = type.split("/");

                  // now iterate over the accepted file types
                  return acceptArr
                      .every(accepted => {
                          const [ acceptedNs, acceptedName ] = accepted;

                          return
                              (acceptedNs === "*" || acceptedNs === namespace) &&
                              (acceptedName === "*" || acceptedName === friendlyName) 
                      });
              } else {
                  return false; // not a file
              }
    }
  }

  return (
    <>
      <div className="chat-box border-theme-5 flex flex-col overflow-hidden xl:border-l xl:border-r p-6" 
      style={{ gridColumn: appState.showGroupInfo ? "span 6 / span 12" : "span 9 / span 12" }}>
        <div className="intro-y box border border-theme-3 dark:bg-dark-2 dark:border-dark-2 flex items-center px-5 py-4">
          <div className="flex items-center mr-auto">
            <div className="w-12 h-12 flex-none image-fit mr-1">
              <Image 
                src={getRecipientAvatar()!}
                width={48}
                height={48}
                alt=""
                className="rounded-full"
              />
            </div>
            <div className="ml-2 overflow-hidden">
              <a href="javascript:void(0)" className="text-base font-medium">{ chat.isGroup ? "Group: " + chat.name : chat?.recipientInfo?.fullName}</a>
            </div>
          </div>
          <a className="text-gray-600 hover:text-theme-1" href="javascript:void(0)" onClick={handleCalling}> 
            <CallIcon fontSize="small" />
          </a>&nbsp;&nbsp;
          <a className="text-gray-600 hover:text-theme-1" href="javascript:void(0)" onClick={() => setShowGroupInfo(!appState.showGroupInfo, dispatch)}> 
            <MoreVertIcon fontSize="small" />
          </a>
        </div>

        <ScrollBarCustom className="overflow-y-auto pt-5 flex-1 px-4">
        {showMessage()}
        <EndOfMessage ref={endOfMessageRef} /> 

        </ScrollBarCustom>

        <div className="intro-y chat-input box border-theme-3 dark:bg-dark-2 dark:border-dark-2 border flex items-center px-5 py-4">
        <DropdownAttach chatId={chat._id!} scrollToBottom={scrollToBottom} recipient={chat.recipientInfo} />
        <input 
        onChange={(e) => setInput(e.target.value)} 
        className="form-control h-12 shadow-none resize-none border-transparent px-5 py-3 focus:outline-none truncate" 
        placeholder="Type your message..."
        style={{ marginRight: "10px", marginLeft: "10px" }}
        value={input}
        onPaste={(e) => handlePaste(e.clipboardData.files)}
        onDragOver={(e) => handleDragFile(e.dataTransfer)}/>
        {/* <InputMessage
          contentEditable="true"
          className="w-full block outline-none py-4 px-4 bg-transparent"
          style={{overflowY: 'auto'}}
          id="input-message"
        /> */}
        
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
        {
          appState.prepareImages.length > 0 ? <PrepareSendImageScreen /> : null
        }
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
