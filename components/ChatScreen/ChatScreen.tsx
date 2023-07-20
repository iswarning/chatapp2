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
import { addMessageToCurrentChat, addNewFileInRoom, addNewImageInRoom, addPrepareSendFiles, pushMessageToListChat, setCurrentChat, setFileUploadDone, setFileUploading, setListFileInRoom, setPrepareSendFiles, setProgress, setShowGroupInfo, setStatusSend } from "@/services/CacheService";
import { AlertError } from "@/utils/core";
import { createMessage } from "@/services/MessageService";
import PrepareSendFileScreen from "./PrepareSendFileScreen";
import { selectChatState } from "@/redux/chatSlice";
import { getImageTypeFileValid } from "@/utils/getImageTypeFileValid";


export default function ChatScreen({ chat, messages }: { chat: ChatType, messages: Array<MessageType> }) {
  const [user] = useAuthState(auth);
  const endOfMessageRef: any = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const dispatch = useDispatch()
  const appState = useSelector(selectAppState)
  const chatState = useSelector(selectChatState)
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

  const sendMessage = async(e: any) => {
    
    e.preventDefault();

    let listPrepareFile = appState.prepareSendFiles

    if (listPrepareFile.length > 0) {
      let images = listPrepareFile.filter((file) => 
      file.name.split(".").pop() === "png"  || 
      file.name.split(".").pop() === "jpg" || 
      file.name.split(".").pop() === "jpeg")
      if (images.length > 0) {
        let keys = await Promise.all(images.map(async(image) => {
          let key = uuidv4()
          let ref = storage
          .ref(`public/chat-room/${chat._id}/photos/${key}`)
          ref
          .put(image)
          .then(() => {
            ref
            .getMetadata()
            .then(async(metadata) => {
              addNewImageInRoom(chat._id!, {
                url: await ref.getDownloadURL(),
                key,
                size: image.size,
                name: image.name.split(".")[0],
                timeCreated: metadata.timeCreated,
                extension: image.name.split(".").pop()!
              }, dispatch)
            })
          })
          return key
        }))
        setPrepareSendFiles([], dispatch)
        processSendMessage("image", JSON.stringify(keys))
      }

      let files = listPrepareFile.filter((file) => 
      file.name.split(".").pop() !== "png"  && 
      file.name.split(".").pop() !== "jpg" && 
      file.name.split(".").pop() !== "jpeg")
      if (files.length > 0) {
        processAttachFile(files)
        setPrepareSendFiles([], dispatch)
      }
    }
    setInput("")
  };

  const processSendMessage = (type: string, message: string) => {
    setStatusSend(StatusSendType.SENDING, dispatch)
    let newMessage = {} as MessageType
    newMessage._id = uuidv4()
    newMessage.message = message
    newMessage.createdAt = new Date().toLocaleString()
    newMessage.senderId = appState.userInfo._id!
    newMessage.type = type

    pushMessageToListChat(chat._id!, newMessage, dispatch)

    createMessage({
      chatRoomId: chat._id,
      message: newMessage.message,
      senderId: newMessage.senderId,
      type: newMessage.type
    })
    .then((data: MessageType) => {
      pushMessageToListChat(chat._id!, newMessage, dispatch)

    setCurrentChat({
      ...chat,
      messages: [
        ...chat.messages!,
        newMessage
      ]
    }, dispatch)
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
  }

  const processAttachFile = (files: File[]) => {
    setStatusSend(StatusSendType.SENDING, dispatch)
    let result = []
    for(const file of files) {
      if (file) {
        let key = uuidv4()
        let fileSize = file.size / 1024 / 1024;
        if (!getImageTypeFileValid().includes(file.name.split(".").pop() ?? "")) {
          AlertError("File upload invalid !")
          return;
        } 
        if (fileSize > 100) {
          AlertError("Size file no larger than 100 MB !")
          return;
        }
        let newMessage = {} as MessageType
        newMessage._id = uuidv4()
        newMessage.message = input
        newMessage.file = JSON.stringify({
          key: key,
          name: file.name.split(".")[0],
          size: fileSize,
          extension: file.name.split(".").pop()
        })
        newMessage.type = "file-uploading"
        newMessage.senderId = appState.userInfo._id!
        newMessage.createdAt = new Date().toLocaleString()
        result.push({
          key: key,
          file: file,
          size: fileSize
        })
        
        addMessageToCurrentChat(newMessage, dispatch)

        pushMessageToListChat(chat._id!, newMessage, dispatch)
      }
    }
    if(result.length > 0){
      uploadFileQueuing(result)
    }
  }

  let count = 0

  const uploadFileQueuing = (result: any) => {
    console.log(chatState.currentChat.messages)
    let path = `public/chat-room/${chat._id!}/files/${result[count].key}`
    storage
      .ref(path)
      .put(result[count].file)
      .on(
        "state_changed",
        (snapshot) => {
          let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          setProgress(progress, dispatch)
          if (progress === 100) {
            setFileUploading(result[count].key, "done", dispatch)
            setFileUploadDone(result[count].key, dispatch)
            if (count === result.length - 1) {
              setStatusSend(StatusSendType.SENT, dispatch)
              return
            }
            count++
            uploadFileQueuing(result)
          } else if(progress > 1 && progress < 100) {
            setFileUploading(result[count].key, "uploading", dispatch)
          }
        },
        (err) => {throw new Error(err.message)},
        () => {
          createMessage({
            message: input,
            type: "file",
            senderId: appState.userInfo._id!,
            file: result[count].key,
            chatRoomId: chat._id
          })
          .then(() => {
            storage
            .ref(path)
            .getMetadata()
            .then(async(metadata) => {
              addNewFileInRoom(chat._id!, {
                url: await storage.ref(path).getDownloadURL(),
                key: result[count].key,
                size: result[count].size,
                name: result[count].file.name.split(".")[0],
                extension: result[count].file.name.split(".").pop(),
                timeCreated: metadata.timeCreated
              }, dispatch)
            })
          })
          .catch(err => {
            console.log(err);
            setStatusSend(StatusSendType.ERROR, dispatch)
            AlertError("Error when send message !")
          })
        }
      );
      
    // NotifyMessage()
  }

  // const NotifyMessage = () => {
  //   let bodyNotify = "";

  //   if (chatState.currentChat.isGroup) {
  //     bodyNotify = chatState.currentChat.name + " sent a file "
  //   } else {
  //     bodyNotify = recipient.data().fullName + " sent a file "
  //   }

    
  // }

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
    for(const file of files) {
      if (appState.prepareSendFiles.length >= 10) {
        AlertError("Maximum files is 10 !")
        return;
      } 
      let fileSize = file.size
      if(appState.prepareSendFiles.length > 0 && appState.prepareSendFiles.find((image) => image.size === fileSize)) return
      addPrepareSendFiles(file,dispatch)
    }
  }

  const handleDrag = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    switch(e.type){
      case 'dragover':
        break;
      case 'dragleave':
        break;
    }
  }

  const handleDrop = (e: any) => {
    handlePaste(e.dataTransfer.files)
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
        <DropdownAttach />
        <input 
        onChange={(e) => setInput(e.target.value)} 
        className="form-control h-12 shadow-none resize-none border-transparent px-5 py-3 focus:outline-none truncate" 
        placeholder="Type your message..."
        style={{ marginRight: "10px", marginLeft: "10px" }}
        value={input}
        onPaste={(e) => handlePaste(e.clipboardData.files)}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        disabled={appState.prepareSendFiles.length > 0}/>
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
          appState.prepareSendFiles.length > 0 ? <PrepareSendFileScreen /> : null
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
