import { auth, db, storage } from "@/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import Image from "next/image";
import TimeAgo from "timeago-react";
import { useState } from "react";
import {useSelector} from 'react-redux'
import { selectAppState } from "@/redux/appSlice";
import { useDispatch } from 'react-redux'
import { ChatType, FileInfo } from "@/types/ChatType";
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { selectChatState } from "@/redux/chatSlice";
import { setCurrentChat, setListFileInRoom, setListImageInRoom, setListMessageInRoom } from "@/services/CacheService";
import mime from "mime-types";
import { getAllMessagesByChatRoomId } from "@/services/MessageService";

export default function ChatComponent({ chat, active }: { chat: ChatType, active: boolean}) {
  const [user] = useAuthState(auth);
  const appState = useSelector(selectAppState)
  const chatState = useSelector(selectChatState)
  const dispatch = useDispatch()

  const recipientInfo = chat.recipientInfo

  // const [lastMessageSnapshot] = useCollection(
  //   db
  //     .collection("chats")
  //     .doc(chat._id)
  //     .collection("messages")
  //     .orderBy("timestamp", 'desc')
  //     .limit(1)
  // );

  // const lastMessage = MapMessageData(lastMessageSnapshot?.docs?.[0]!)

  // const [userInfoOfLastMessageSnapshot] = useCollection(
  //   db.collection("users").where("email", "==", String(lastMessage?.user))
  // );

  const handleShowChatScreen = async() => {
    let chatExist = chatState.listChat.find((chatExist) => chatExist._id === chat._id)
    let newMessages = chatExist?.messages
    
    if (!chatExist?.messages) {
      newMessages = await getAllMessagesByChatRoomId(chat._id!)
      setListMessageInRoom(chat._id!, newMessages, dispatch)
    }

    setCurrentChat({
      ...chatExist as ChatType,
      messages: newMessages
    }, dispatch)

    setListImageInRoom(chat._id!, await getListImage(), dispatch)
    setListFileInRoom(chat._id!, await getListFile(), dispatch)
  };

  const getListImage = async() => {
    return await Promise.all(
      (await storage.ref(`public/chat-room/${chat._id}/photos`).listAll())
      .items
      .map(async(result) => {
      let metadata = await result.getMetadata()
      return {
        url: await result.getDownloadURL(),
        key: result.name,
        name: result.name + mime.extension(metadata.contentType),
        size: metadata.size,
        timeCreated: metadata.timeCreated
      }
    })) as FileInfo[]
  }

  const getListFile = async() => {
    return await Promise.all(
      (await storage.ref(`public/chat-room/${chat._id}/files`).listAll())
      .items
      .map(async(result) => {
      let metadata = await result.getMetadata()  
      return {
        url: await result.getDownloadURL(),
        key: result.name,
        name: result.name + mime.extension(metadata.contentType),
        size: metadata.size,
        timeCreated: metadata.timeCreated
      }
    })) as FileInfo[]
  } 

  // const getMessage = async (id: string) => {
  //   const ref = db
  //     .collection("chats")
  //     .doc(id)
  //     .collection("messages")
  //     .orderBy("timestamp")
  //   const snap = await ref.get();
  //   return snap.docs.map((msg) => MapMessageData(msg)); 
  // };

  const getRecipientAvatar = () => {
    if (chat?.isGroup) {
      if (chat?.photoURL?.length! > 0) return chat?.photoURL;
      else return "/images/group-default.jpg";
    } else {
      let photoUrl = recipientInfo?.photoURL;
      if (photoUrl?.length! > 0) return photoUrl;
      else return "/images/avatar-default.png";
    }
  };

  // function handleShowLastMessage() {
  //   if(!lastMessage) return null;
  //   const StyleIcon = {
  //     fontSize: '15px', 
  //     marginBottom: '4px'
  //   }
  //   if (chat.isGroup) {

  //     if (lastMessage?.type === "image") {
  //       if (lastMessage?.user === user?.email) {
  //         return <div className={active ? "text-opacity-80 truncate mt-0.5 text-white" : "text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500"}>
  //           You: <ImageOutlinedIcon style={StyleIcon} /> Image</div>
  //       } else
  //         return (
  //           <div className={active ? "text-opacity-80 truncate mt-0.5 text-white" : "text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500"}>
  //             {userInfoOfLastMessageSnapshot?.docs?.[0]?.data()?.fullName}
  //             : <ImageOutlinedIcon style={StyleIcon} /> Image</div>
  //           );
  //     }
      
  //     if (lastMessage?.type === "text-image") {
  //       if (lastMessage?.user === user?.email) {
  //         return <div className={active ? "text-opacity-80 truncate mt-0.5 text-white" : "text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500"}>
  //           You sent a message</div>
  //       } else
  //         return <div className={active ? "text-opacity-80 truncate mt-0.5 text-white" : "text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500"}>
  //           {userInfoOfLastMessageSnapshot?.docs?.[0]?.data()?.fullName}
  //           sent a message</div>
  //     }

  //     if (lastMessage?.type === "text") {
  //       if (lastMessage?.user === user?.email) {
  //         return <div className={active ? "text-opacity-80 truncate mt-0.5 text-white" : "text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500"}>
  //           You: {lastMessage?.message}</div>
  //       } else
  //         return (
  //           <div className={active ? "text-opacity-80 truncate mt-0.5 text-white" : "text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500"}>
  //             {userInfoOfLastMessageSnapshot?.docs?.[0]?.data()?.fullName} : {lastMessage?.message}
  //           </div>
  //         );
  //     }

  //     if (lastMessage?.type === "file") {
  //       if (lastMessage?.user === user?.email) {
  //         return <div className={active ? "text-opacity-80 truncate mt-0.5 text-white" : "text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500"}>You: <InsertDriveFileOutlinedIcon style={StyleIcon}/> File</div>
  //       } else
  //         return (
  //           <div className={active ? "text-opacity-80 truncate mt-0.5 text-white" : "text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500"}>
  //             {userInfoOfLastMessageSnapshot?.docs?.[0]?.data()?.fullName}
  //             : 
  //             <InsertDriveFileOutlinedIcon style={StyleIcon}/> File</div>
  //         );    
  //     }

  //   } else {
      
  //     if (lastMessage.type === "image") {
  //       if (lastMessage?.user === user?.email) {
  //         return <div className={active ? "text-opacity-80 truncate mt-0.5 text-white" : "text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500"}>
  //           You: <ImageOutlinedIcon style={StyleIcon} /> Image</div>
  //       } else
  //         return <div className={active ? "text-opacity-80 truncate mt-0.5 text-white" : "text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500"}>
  //             {recipientInfo?.fullName}
  //             : <ImageOutlinedIcon style={StyleIcon} /> Image</div>
  //     }

  //     if (lastMessage?.type === "text-image") {
  //       if (lastMessage?.user === user?.email) {
  //         return <div className={active ? "text-opacity-80 truncate mt-0.5 text-white" : "text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500"}>You sent a message</div>
  //       } else
  //         return (
  //           <div className={active ? "text-opacity-80 truncate mt-0.5 text-white" : "text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500"}>
  //             {recipientInfo?.fullName} sent a message
  //           </div>
  //         );
  //     }

  //     if (lastMessage.type === "text") {
  //       if (lastMessage.user === user?.email) {
  //         return <div className={active ? "text-opacity-80 truncate mt-0.5 text-white" : "text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500"}>
  //           You: {lastMessage?.message}
  //         </div>
  //       } else return <div className={active ? "text-opacity-80 truncate mt-0.5 text-white" : "text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500"}>{lastMessage?.message}</div>;
  //     }

  //     if (lastMessage?.type === "file") { 
  //       if (lastMessage?.user === user?.email) {
  //         return <div className={active ? "text-opacity-80 truncate mt-0.5 text-white" : "text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500"}>
  //           You: <InsertDriveFileOutlinedIcon style={StyleIcon}/> File
  //         </div>;
  //       } else
  //         return <div className={active ? "text-opacity-80 truncate mt-0.5 text-white" : "text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500"}>
  //         {recipientInfo?.fullName}
  //         : <InsertDriveFileOutlinedIcon style={StyleIcon} /> File</div>
  //     }
  //   }
  // };

  // const setSeenMessage = async () => {
  //   const messageSnap = await db
  //     .collection("chats")
  //     .doc(chat._id)
  //     .collection("messages")
  //     .get();
  //   if (messageSnap) {
  //     messageSnap?.docs?.forEach((m) => {
  //       (async () => {
  //         const msgRef = db
  //           .collection("chats")
  //           .doc(chat._id)
  //           .collection("messages")
  //           .doc(m._id);
  //         const res = await msgRef.get();
  //         if (res?.data()?.user === user?.email) return;
  //         if (res?.data()?.seen?.includes(user?.email)) return;
  //         let result = res?.data()?.seen;
  //         result.push(user?.email);
  //         await msgRef.set({ ...res.data(), seen: result });
  //       })();
  //     });
  //   }
  // };

  const handleGroupOnline = (): boolean => {
    let amountUserOnline = 0;
    chat.members.forEach((userChat: string) => {
      if(appState.userOnline?.find((u: string) => u === userChat && u !== user?.email)?.length! > 0 && user !== user?.email) {
        amountUserOnline++
      }
    })
    return amountUserOnline > 0;
  }

  return (
<div className="intro-x" onClick={() => handleShowChatScreen()}>
{/* <div className="intro-x"> */}
<div>
<div className={ active ? "chat-list box cursor-pointer relative flex items-center px-4 py-3 mt-4 bg-theme-1 dark:bg-theme-1" : "chat-list box cursor-pointer relative flex items-center px-4 py-3 mt-4"}>
<div className="w-12 h-12 flex-none image-fit mr-1">
{
  getRecipientAvatar() ? <Image
    src={getRecipientAvatar()!}
    width={48}
    height={48}
    alt="Avatar"
    className="rounded-full"
  /> : null
}
{!chat.isGroup ? (
  appState.userOnline?.find((u: any) => u === recipientInfo?.email) ? (
    <div className="border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2" style={{background: 'green'}}></div>
  ) : (
    <span className="border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2" style={{background: 'gray'}}></span>
  )
) : handleGroupOnline() ? (
  <div className="border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2" style={{background: 'green'}}></div>
) : (
  <span className="border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2"style={{background: 'gray'}}></span>
)}
</div>
<div className="ml-2 overflow-hidden">
<a href="javascript:void(0)" className={active ? "font-medium text-white" :"font-medium text-gray-800 dark:text-white"}>{ chat.isGroup ? "Group: " + chat.name : recipientInfo?.fullName}</a>
{/* {lastMessage
    ? handleShowLastMessage()
: ""} */}
</div>
<div className="ml-auto">
<div className={active ? "whitespace-nowrap text-opacity-80 text-xs text-white" : "whitespace-nowrap text-opacity-80 text-xs text-gray-800 dark:text-gray-600"}>
{/* {lastMessage ? (
      lastMessage?.timestamp ? (
        <TimeAgo datetime={lastMessage?.timestamp?.toDate()} />
      ) : (
        ""
      )
    ) : null} */}
</div>
<div className="chat-list__action dropdown transition duration-200 opacity-0 mt-1 -mb-1 -mr-1 ml-auto">
<a className="dropdown-toggle block text-opacity-70 text-gray-500" href="javascript:void(0)"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down w-6 h-6"><polyline points="6 9 12 15 18 9"></polyline></svg> </a>

</div>
</div>
<div className="bg-theme-1 flex items-center justify-center absolute top-0 right-0 text-xs rounded-full font-medium mr-4"></div>
</div>
</div>
</div>
  );
}

export const CustomAvatar = styled(Image)`
  border-radius: 50%;
`;
