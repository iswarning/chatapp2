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
      .orderBy("timestamp", 'asc')
      .limitToLast(1)
  );

  const lastMessage = lastMessageSnapshot?.docs?.[0]?.data();

  const [userInfoOfLastMessageSnapshot] = useCollection(
    db.collection("users").where("email", "==", String(lastMessage?.user))
  );

  const handleShowChatScreen = () => {
    let data = chat;
    getMessage(chat.id).then((mess) => {
      data.messages = mess.docs.map((m) => MapMessageData(m))
      dispatch(setChatData(data))
    })
    setSeenMessage().catch(err => console.log(err));
  };

  const getMessage = async (id: string) => {
    const snap = await db
      .collection("chats")
      .doc(id)
      .collection("messages")
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

  const svgIconImage = () => {
    return <svg className="svg-icon" viewBox="0 0 20 20">
    <path d="M18.555,15.354V4.592c0-0.248-0.202-0.451-0.45-0.451H1.888c-0.248,0-0.451,0.203-0.451,0.451v10.808c0,0.559,0.751,0.451,0.451,0.451h16.217h0.005C18.793,15.851,18.478,14.814,18.555,15.354 M2.8,14.949l4.944-6.464l4.144,5.419c0.003,0.003,0.003,0.003,0.003,0.005l0.797,1.04H2.8z M13.822,14.949l-1.006-1.317l1.689-2.218l2.688,3.535H13.822z M17.654,14.064l-2.791-3.666c-0.181-0.237-0.535-0.237-0.716,0l-1.899,2.493l-4.146-5.42c-0.18-0.237-0.536-0.237-0.716,0l-5.047,6.598V5.042h15.316V14.064z M12.474,6.393c-0.869,0-1.577,0.707-1.577,1.576s0.708,1.576,1.577,1.576s1.577-0.707,1.577-1.576S13.343,6.393,12.474,6.393 M12.474,8.645c-0.371,0-0.676-0.304-0.676-0.676s0.305-0.676,0.676-0.676c0.372,0,0.676,0.304,0.676,0.676S12.846,8.645,12.474,8.645"></path>
  </svg>
  }

  const svgIconFile = () => {
    return <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-file-earmark-pdf" viewBox="0 0 16 16"> <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/> <path d="M4.603 14.087a.81.81 0 0 1-.438-.42c-.195-.388-.13-.776.08-1.102.198-.307.526-.568.897-.787a7.68 7.68 0 0 1 1.482-.645 19.697 19.697 0 0 0 1.062-2.227 7.269 7.269 0 0 1-.43-1.295c-.086-.4-.119-.796-.046-1.136.075-.354.274-.672.65-.823.192-.077.4-.12.602-.077a.7.7 0 0 1 .477.365c.088.164.12.356.127.538.007.188-.012.396-.047.614-.084.51-.27 1.134-.52 1.794a10.954 10.954 0 0 0 .98 1.686 5.753 5.753 0 0 1 1.334.05c.364.066.734.195.96.465.12.144.193.32.2.518.007.192-.047.382-.138.563a1.04 1.04 0 0 1-.354.416.856.856 0 0 1-.51.138c-.331-.014-.654-.196-.933-.417a5.712 5.712 0 0 1-.911-.95 11.651 11.651 0 0 0-1.997.406 11.307 11.307 0 0 1-1.02 1.51c-.292.35-.609.656-.927.787a.793.793 0 0 1-.58.029zm1.379-1.901c-.166.076-.32.156-.459.238-.328.194-.541.383-.647.547-.094.145-.096.25-.04.361.01.022.02.036.026.044a.266.266 0 0 0 .035-.012c.137-.056.355-.235.635-.572a8.18 8.18 0 0 0 .45-.606zm1.64-1.33a12.71 12.71 0 0 1 1.01-.193 11.744 11.744 0 0 1-.51-.858 20.801 20.801 0 0 1-.5 1.05zm2.446.45c.15.163.296.3.435.41.24.19.407.253.498.256a.107.107 0 0 0 .07-.015.307.307 0 0 0 .094-.125.436.436 0 0 0 .059-.2.095.095 0 0 0-.026-.063c-.052-.062-.2-.152-.518-.209a3.876 3.876 0 0 0-.612-.053zM8.078 7.8a6.7 6.7 0 0 0 .2-.828c.031-.188.043-.343.038-.465a.613.613 0 0 0-.032-.198.517.517 0 0 0-.145.04c-.087.035-.158.106-.196.283-.04.192-.03.469.046.822.024.111.054.227.09.346z"/> </svg>
  }

  const handleShowLastMessage = () => {
    const StyleIcon = {
      fontSize: '15px', 
      marginBottom: '4px'
    }
    if (chat.isGroup) {
      switch(lastMessage?.type){
        case "image": 
          if (lastMessage?.user === user?.email) {
            return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500 ">You: <ImageOutlinedIcon style={StyleIcon} /> Image</div>
          } else
            return (
              <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500">
                {userInfoOfLastMessageSnapshot?.docs?.[0]?.data()?.fullName}
                : <ImageOutlinedIcon style={StyleIcon} /> Image</div>
              );
        case "text-image": 
          if (lastMessage?.user === user?.email) {
            return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500">You sent a message</div>
          } else
            return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500">
              {userInfoOfLastMessageSnapshot?.docs?.[0]?.data()?.fullName}
              sent a message</div>
        case "text":
          if (lastMessage?.user === user?.email) {
            return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500">You: {lastMessage?.message}</div>
          } else
            return (
              <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500">
                {userInfoOfLastMessageSnapshot?.docs?.[0]?.data()?.fullName} : {lastMessage?.message}
              </div>
            );
        case "file":
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
      switch(lastMessage?.type){
        case "image": 
          if (lastMessage?.user === user?.email) {
            return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500 ">You: <ImageOutlinedIcon style={StyleIcon} /> Image</div>
          } else
            return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500">
                {recipientSnapshot?.docs?.[0]?.data()?.fullName}
                : <ImageOutlinedIcon style={StyleIcon} /> Image</div>
        case "text-image": 
          if (lastMessage?.user === user?.email) {
            return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500 ">You sent a message</div>
          } else
            return (
              <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500 ">
                {recipientSnapshot?.docs?.[0].data().fullName} sent a message
              </div>
            );
        case "text":
          if (lastMessage?.user === user?.email) {
            <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500 ">
              You: {lastMessage?.message}
            </div>
          } else return <div className="text-opacity-80 truncate mt-0.5 text-gray-800 dark:text-gray-500 ">{lastMessage?.message}</div>;
        case "file":
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
<div className="chat-list box cursor-pointer relative flex items-center px-4 py-3 mt-4 ">
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
<div className="dropdown-menu w-40">
<div className="dropdown-menu__content box dark:bg-dark-1 p-2">
<a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-share-2 w-4 h-4 mr-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> Share Contact </a>
<a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-copy w-4 h-4 mr-2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy Contact </a>
</div>
</div>
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
