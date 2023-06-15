import { auth, db } from "@/firebase";
import getRecipientEmail from "@/utils/getRecipientEmail";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import Image from "next/image";
import TimeAgo from "timeago-react";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {useSelector} from 'react-redux'
import { selectAppState, setChatData } from "@/redux/appSlice";
import { useDispatch } from 'react-redux'
import { ChatType } from "@/types/ChatType";
import { MapMessageData } from "@/types/MessageType";
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

export default function ChatComponent({ chat, active }: { chat: ChatType, active: boolean}) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [userOnline, setUserOnline] = useState<Array<string>>();
  const appState = useSelector(selectAppState)
  const dispatch = useDispatch()
  // const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);

  useEffect(() => {
    
  }, []);

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  const [lastMessageSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(chat.id)
      .collection("messages")
      .orderBy("timestamp", 'desc')
      .limit(1)
  );

  const lastMessage = MapMessageData(lastMessageSnapshot?.docs?.[0]!);

  const [userInfoOfLastMessageSnapshot] = useCollection(
    db.collection("users").where("email", "==", String(lastMessage?.user))
  );

  const handleShowChatScreen = async() => {
    let chatData = chat;
    const messData = await getMessage(chat.id);
    chatData.messages = messData.docs.map((m) => MapMessageData(m));
    dispatch(setChatData(chatData))
    setSeenMessage().catch(err => console.log(err));
  };

  const getMessage = async (id: string) => {
    const snap = await db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp")
      .get();
    return snap;
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

  const handleShowLastMessage = () => {
    if(!lastMessageSnapshot) return;
    const StyleIcon = {
      fontSize: '15px', 
      marginBottom: '4px'
    }
    if (chat.isGroup) {

      if (lastMessage?.type === "image") {
        if (lastMessage?.user === user?.email) {
          return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500 ">You: <ImageOutlinedIcon style={StyleIcon} /> Image</div>
        } else
          return (
            <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500">
              {userInfoOfLastMessageSnapshot?.docs?.[0]?.data()?.fullName}
              : <ImageOutlinedIcon style={StyleIcon} /> Image</div>
            );
      }
      
      if (lastMessage?.type === "text-image") {
        if (lastMessage?.user === user?.email) {
          return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500">You sent a message</div>
        } else
          return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500">
            {userInfoOfLastMessageSnapshot?.docs?.[0]?.data()?.fullName}
            sent a message</div>
      }

      if (lastMessage?.type === "text") {
        if (lastMessage?.user === user?.email) {
          return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500">You: {lastMessage?.message}</div>
        } else
          return (
            <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500">
              {userInfoOfLastMessageSnapshot?.docs?.[0]?.data()?.fullName} : {lastMessage?.message}
            </div>
          );
      }

      if (lastMessage?.type === "file") {
        if (lastMessage?.user === user?.email) {
          return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500">You: <InsertDriveFileOutlinedIcon style={StyleIcon}/> File</div>
        } else
          return (
            <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500">
              {userInfoOfLastMessageSnapshot?.docs?.[0]?.data()?.fullName}
              : 
              <InsertDriveFileOutlinedIcon style={StyleIcon}/> File</div>
          );    
      }

    } else {
      
      if (lastMessageSnapshot?.docs?.[0].data().type === "image") {
        if (lastMessage?.user === user?.email) {
          return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500 ">You: <ImageOutlinedIcon style={StyleIcon} /> Image</div>
        } else
          return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500">
              {recipientSnapshot?.docs?.[0]?.data()?.fullName}
              : <ImageOutlinedIcon style={StyleIcon} /> Image</div>
      }

      if (lastMessage?.type === "text-image") {
        if (lastMessage?.user === user?.email) {
          return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500 ">You sent a message</div>
        } else
          return (
            <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500 ">
              {recipientSnapshot?.docs?.[0].data().fullName} sent a message
            </div>
          );
      }

      if (lastMessage.type === "text") {
        if (lastMessage.user === user?.email) {
          return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500 ">
            You: {lastMessage?.message}
          </div>
        } else return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500 ">{lastMessage?.message}</div>;
      }

      if (lastMessage?.type === "file") { 
        if (lastMessage?.user === user?.email) {
          return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500">
            You: <InsertDriveFileOutlinedIcon style={StyleIcon}/> File
          </div>;
        } else
          return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500">
          {recipientSnapshot?.docs?.[0]?.data()?.fullName}
          : <InsertDriveFileOutlinedIcon style={StyleIcon} /> File</div>
      }
    }
  };

  const setSeenMessage = async () => {
    const messageSnap = await db
      .collection("chats")
      .doc(chat.id)
      .collection("messages")
      .get();
    if (messageSnap) {
      messageSnap?.docs?.forEach((m) => {
        (async () => {
          const msgRef = db
            .collection("chats")
            .doc(chat.id)
            .collection("messages")
            .doc(m.id);
          const res = await msgRef.get();
          if (res?.data()?.user === user?.email) return;
          if (res?.data()?.seen?.includes(user?.email)) return;
          let result = res?.data()?.seen;
          result.push(user?.email);
          await msgRef.set({ ...res.data(), seen: result });
        })();
      });
    }
  };

  const handleGroupOnline = (): boolean => {
    let amountUserOnline = 0;
    chat.users.forEach((userChat: string) => {
      if(appState.userOnline?.find((u: string) => u === userChat && u !== user?.email)?.length! > 0 && user !== user?.email) {
        amountUserOnline++
      }
    })
    return amountUserOnline > 0;
  }

  const classActive = () => " bg-theme-1 dark:bg-theme-1"

  return (
    // <div
    //   className={
    //     "entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white mb-4 rounded p-4 flex shadow-md" +
    //     (active ? " border-l-4 border-red-500" : "")
    //   }
    //   onClick={handleShowChatScreen}
    // >
    //   <div className="flex-2">
    //     <div className="w-12 h-12 relative">
    //       <CustomAvatar
    //         src={getRecipientAvatar()}
    //         width={50}
    //         height={50}
    //         alt="User Avatar"
    //       />
    //       {!chat.isGroup ? (
    //         appState.userOnline?.find((u: any) => u === recipientSnapshot?.docs?.[0]?.data().email) ? (
    //           <span className="absolute w-4 h-4 bg-green-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
    //         ) : (
    //           <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
    //         )
    //       ) : handleGroupOnline() ? (
    //         <span className="absolute w-4 h-4 bg-green-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
    //       ) : (
    //         <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
    //       )}
    //     </div>
    //   </div>
    //   <div className="flex-1 px-2">
    //     <div className="truncate w-40">
    //       <span className="text-gray-800">
    //         {chat.isGroup
    //           ? "Group: " + chat.name
    //           : recipientSnapshot?.docs?.[0].data().fullName}
    //       </span>
    //     </div>
    //     <div className="truncate w-40">
    //       <small className="text-gray-600 ">
    //         {lastMessageSnapshot?.docs.length! > 0
    //           ? handleShowLastMessage()
    //           : ""}
    //       </small>
    //     </div>
    //   </div>
    //   <div className="flex-2 text-right">
    //     <div>
    //       <small className="text-gray-500">
    //         <div className="pb-2">
    //           {lastMessageSnapshot?.docs.length! > 0 ? (
    //             lastMessage?.timestamp?.toDate() ? (
    //               <TimeAgo datetime={lastMessage?.timestamp?.toDate()} />
    //             ) : (
    //               "Unavailable"
    //             )
    //           ) : null}
    //         </div>
    //       </small>
    //     </div>
    //     <div>
    //       {lastMessage?.message?.length > 0 &&
    //       lastMessage?.user !== user?.email ? (
    //         lastMessage?.seen.find(
    //           (userSeen: string) => userSeen === user?.email
    //         ) ? null : (
    //           <small className="text-sm bg-blue-500 mb-1 rounded-full h-3 w-3 leading-4 text-center inline-block"></small>
    //         )
    //       ) : null}
    //     </div>
    //   </div>
    // </div>
//     <div className="intro-x">
// <div className="zoom-in">
//   {/* active bg-theme-1 dark:bg-theme-1 */}
// <div className="chat-list box cursor-pointer relative flex items-center px-4 py-3 mt-4 ">
// <div className="w-12 h-12 flex-none image-fit mr-1">
// <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-full" src="https://topson.left4code.com/dist/images/profile-9.jpg"/>
// <div className="bg-green-500 border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2"></div>
// </div>
// <div className="ml-2 overflow-hidden">
// <a href="javascript:;" className="font-medium text-white">{recipientSnapshot?.docs?.[0]?.data().fullName}</a>
// <div className="text-opacity-80 truncate mt-0.5 text-white">
// {lastMessageSnapshot?.docs.length! > 0
//     ? handleShowLastMessage()
// : ""}
// </div>
// </div>
// <div className="flex flex-col">
// <div className="whitespace-nowrap text-opacity-80 text-xs text-white">
// {lastMessageSnapshot?.docs.length! > 0 ? (
//       lastMessage?.timestamp?.toDate() ? (
//         <TimeAgo datetime={lastMessage?.timestamp?.toDate()} />
//       ) : (
//         "Unavailable"
//       )
//     ) : null}
// </div>
// <div className="chat-list__action dropdown transition duration-200 opacity-0 mt-1 -mb-1 -mr-1 ml-auto">
// <a className="dropdown-toggle block text-opacity-70 text-white" href="javascript:;"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-chevron-down w-6 h-6"><polyline points="6 9 12 15 18 9"></polyline></svg> </a>
// <div className="dropdown-menu w-40">
// <div className="dropdown-menu__content box dark:bg-dark-1 p-2">
// <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-share-2 w-4 h-4 mr-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> Share Contact </a>
// <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-copy w-4 h-4 mr-2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy Contact </a>
// </div>
// </div>
// </div>
// </div>
// <div className="bg-theme-1 flex items-center justify-center absolute top-0 right-0 text-xs rounded-full font-medium mr-4"></div>
// </div>
// </div>
// </div>
<div className="intro-x" onClick={() => handleShowChatScreen()}>
<div className="zoom-in">
<div className={ active ? "chat-list box cursor-pointer relative flex items-center px-4 py-3 mt-4 bg-theme-1 dark:bg-theme-1" : "chat-list box cursor-pointer relative flex items-center px-4 py-3 mt-4"}>
<div className="w-12 h-12 flex-none image-fit mr-1">
{
  getRecipientAvatar() ? <Image
    src={getRecipientAvatar()}
    width={48}
    height={48}
    alt="Avatar"
    className="rounded-full"
  /> : null
}
{!chat.isGroup ? (
  appState.userOnline?.find((u: any) => u === recipientSnapshot?.docs?.[0]?.data().email) ? (
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
<a href="javascript:;" className="font-medium text-gray-800 dark:text-white">{ chat.isGroup ? "Group: " + chat.name : recipientSnapshot?.docs?.[0]?.data().fullName}</a>
{lastMessageSnapshot?.docs.length! > 0
    ? handleShowLastMessage()
: ""}
</div>
<div className="ml-auto">
<div className="whitespace-nowrap text-opacity-80 text-xs text-gray-800 dark:text-gray-600">
{lastMessageSnapshot?.docs.length! > 0 ? (
      lastMessage?.timestamp?.toDate() ? (
        <TimeAgo datetime={lastMessage?.timestamp?.toDate()} />
      ) : (
        "Unavailable"
      )
    ) : null}
</div>
<div className="chat-list__action dropdown transition duration-200 opacity-0 mt-1 -mb-1 -mr-1 ml-auto">
<a className="dropdown-toggle block text-opacity-70 text-gray-500" href="javascript:;"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-chevron-down w-6 h-6"><polyline points="6 9 12 15 18 9"></polyline></svg> </a>

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
