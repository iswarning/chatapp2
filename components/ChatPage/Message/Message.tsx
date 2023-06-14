import { auth, db, storage } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { CustomAvatar } from "../ChatComponent";
import styled from "styled-components";
import { lazy, useState } from "react";
import {getEmojiData, getEmojiIcon} from "@/utils/getEmojiData";
import { useCollection } from "react-firebase-hooks/firestore";
import sendNotificationFCM from "@/utils/sendNotificationFCM";
import getRecipientEmail from "@/utils/getRecipientEmail";
import { MessageType } from "@/types/MessageType";
import { useSelector } from "react-redux";
import { selectAppState } from "@/redux/appSlice";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Image from "next/image";
import TimeAgo from "timeago-react";
import firebase from "firebase";

export default function Message({
  message,
  timestamp,
  photoURL,
  chatId,
  showAvatar
}: {
  message: MessageType;
  timestamp: any;
  photoURL: string;
  chatId: string;
  showAvatar: string | null
}) {
  const [userLoggedIn] = useAuthState(auth);
  const [isShown, setIsShown] = useState(false);
  const [isShownReaction, setIsShownReaction] = useState(false);
  const [load, setLoad] = useState(0);
  const appState = useSelector(selectAppState);
  const formatDate = (dt: any) => {
    let d = new Date(dt);
    return d.getHours() + ":" + d.getMinutes();
  };

  const [reactionSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .doc(message.id)
      .collection("reaction")
      .orderBy("timestamp")
      .limitToLast(1)
  );

  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", message.user)
  );

  const handleReaction = async (event: any, emoji: number) => {
    event.preventDefault();
    try {
      await db
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .doc(message.id)
        .collection("reaction")
        .add({
          senderEmail: userLoggedIn?.email,
          emoji: String.fromCodePoint(emoji),
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      await sendNotificationFCM(
        "Notification",
        userLoggedIn?.displayName +
          " dropped an emotion " +
          String.fromCodePoint(emoji) +
          " into your message",
        recipientSnapshot?.docs?.[0]?.data().fcm_token
      );
    } catch (error) {
      console.log(error);
    }
    setIsShown(false);
  };

  const [imageInMessageSnap] = useCollection(
    db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .doc(message.id)
      .collection("imageInMessage")
  );

  const [fileInMessageSnap] = useCollection(
    db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .doc(message.id)
      .collection("fileInMessage")
  );

  const handleMessage = () => {
    let messageExport: string = message.message;
    if (message.type === "text-image") {
      imageInMessageSnap?.docs?.forEach((img) => {
        messageExport = messageExport.replace(
          img.data().key,
          `<img 
            loading="lazy"
            decoding="async" 
            src="${img.data().url}" 
            style="color: transparent;"/>`
        );
      });
    }
    return <div 
            dangerouslySetInnerHTML={{ __html: messageExport }} 
            style={{fontSize: message.type === 'text' && getEmojiIcon.includes(message.message) && message.message.length === 2 ? '50px' : '' }}>
            </div>;
  };

  const handleFile = () => {
    let storageRef = firebase.storage().ref(`public/images/message/${message.id}/#file-msg-0`)
    storageRef.listAll().then((allFile) => {
      allFile.items.forEach((file) => {
        file.getDownloadURL().then((url) => {
          console.log(url)
          return <div></div>
        }).catch(er => console.log(er))
      })
    }).catch(er => console.log(er))
    return <div></div>
    // const blobPart: Blob[] = [];
    // fileInMessageSnap?.docs?.forEach((file) => {
    //   // `url` is the download URL for 'images/stars.jpg'

    //   // This can be downloaded directly:
    //   const xhr = new XMLHttpRequest();
    //   xhr.responseType = 'blob';
    //   xhr.onload = (event) => {
    //     const blob = xhr.response;
    //     console.log(blob);
    //   };
    //   xhr.open('GET', file.data().url);
    //   xhr.send();
    // });
    // const file = new Blob(blobPart);
    // if (message.type === "file" && fileInMessageSnap?.docs?.length! > 0) {
    //   return (
    //     <>
    //       <div className="flex m-2">
    //         <div className="mx-2">
    //           <UploadFileIcon fontSize="large" />
    //         </div>
    //         <span className="text-2xl mx-2">{file.name}</span>
    //         <div className="cursor-pointer mx-2">
    //           <FileDownloadIcon fontSize="large" />
    //         </div>
    //         <br />
    //       </div>
    //       <div className="flex ml-6">
    //         <small>
    //           Size: {file.size}
    //           {" MB"}
    //         </small>
    //       </div>
    //     </>
    //   );
    // }
  };

  return (
    <>
      {
        // Sender
        message.user === userLoggedIn?.email ? (
          <>
          <div className="intro-x chat-text-box flex items-end float-right mb-4">
<div className="w-full">
<div>
<div className="chat-text-box__content flex items-center float-right">
{/* Message action */}
<div className="hidden sm:block dropdown relative mr-3 mt-3">
<a href="javascript:;" className="dropdown-toggle w-4 h-4"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </a>
<div className="dropdown-menu w-40">
<div className="dropdown-menu__content box dark:bg-dark-1 p-2">
<a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-corner-up-left w-4 h-4 mr-2"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg> Reply </a>
<a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-trash w-4 h-4 mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete </a>
</div>
</div>
</div>
{/* Message content */}
<div className="box leading-relaxed bg-theme-1 text-opacity-80 text-white px-4 py-3 mt-3"> {handleMessage()} </div>
</div>
{/* <div className="clear-both"></div>
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
<div className="rounded-md text-gray-700 chat-text-box__content__text--image flex justify-end mt-3">
<div className="tooltip w-16 h-16 image-fit zoom-in">
<img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-md" src="https://topson.left4code.com/dist/images/preview-4.jpg"/>
</div>
<div className="tooltip w-16 h-16 image-fit ml-2 zoom-in">
<img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-md" src="https://topson.left4code.com/dist/images/preview-14.jpg"/>
</div>
<div className="tooltip w-16 h-16 image-fit ml-2 zoom-in">
<img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-md" src="https://topson.left4code.com/dist/images/preview-12.jpg"/>
</div>
</div>
</div> */}
</div>
<div className="clear-both mb-2"></div>
{
  showAvatar && showAvatar === message.id ? <div className="text-gray-600 text-xs text-right">{ <TimeAgo datetime={timestamp} /> }</div> : null
}
</div>
<div className="chat-text-box__photo w-10 h-10 hidden sm:block flex-none image-fit relative ml-4">
{
  showAvatar && showAvatar === message.id && userLoggedIn?.photoURL ? <Image
    src={userLoggedIn?.photoURL}
    width={48}
    height={48}
    alt=""
    className="rounded-full"
  /> : null
}
</div>
</div>
<div className="clear-both"></div>
          </>
          // <div className="message me mb-4 flex text-right">
          //   <div className="flex-1 px-2">
          //     <div
          //       className="inline-block p-2 px-4 text-white relative"
          //       style={{ backgroundColor: "#3182ce", borderRadius: "10px" }}
          //     >
          //       {handleFile()}
          //       {message.type === "text-image" || message.type === "text"
          //         ? handleMessage()
          //         : null}
          //     </div>
          //     {/* <div className="pr-4"><small className="text-gray-500">{formatDate(message.timestamp)}</small></div> */}
          //   </div>
          // </div>
        ) : (
          // Reciever
          // <div className="message mb-4 flex">
          //   <div className="flex-2">
          //     <div className="w-12 h-12 relative">
          //       <CustomAvatar
          //         src={photoURL}
          //         width={50}
          //         height={50}
          //         alt="User Avatar"
          //       />
          //       {appState.userOnline?.find(
          //         (u: any) => u === recipientSnapshot?.docs?.[0]?.data().email
          //       ) ? (
          //         <span className="absolute w-4 h-4 bg-green-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
          //       ) : (
          //         <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
          //       )}
          //     </div>
          //   </div>
          //   <div
          //     className="flex-1 px-2"
          //     onMouseEnter={() => setIsShown(true)}
          //     onMouseLeave={() => setIsShown(false)}
          //   >
          //     <div
          //       className="inline-block bg-gray-300 p-2 px-4 text-gray-700 relative"
          //       style={{
          //         backgroundColor: "rgba(226,232,240,1)",
          //         borderRadius: "10px",
          //       }}
          //     >
          //       {handleMessage()}
          //       {reactionSnapshot?.docs?.length! > 0 ? (
          //         <ReactionContainerReciever>
          //           <div>
          //             <span key={reactionSnapshot?.docs?.[0]?.id}>
          //               {reactionSnapshot?.docs?.[0]?.data()?.emoji}
          //             </span>
          //           </div>
          //         </ReactionContainerReciever>
          //       ) : null}
          //     </div>
          //     &nbsp;
          //     <div className="inline-block ">
          //       {isShown ? (
          //         <span
          //           className="text-center text-gray-400 hover:text-gray-800 cursor-pointer relative"
          //           onMouseEnter={() => setIsShownReaction(true)}
          //         >
          //           <svg
          //             fill="none"
          //             strokeLinecap="round"
          //             strokeLinejoin="round"
          //             strokeWidth="2"
          //             stroke="currentColor"
          //             viewBox="0 0 24 24"
          //             className="h-6 w-6"
          //           >
          //             <path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          //           </svg>
          //           {isShownReaction ? (
          //             <div className="flex flex-row absolute px-4">
          //               {getEmojiData.map((emoji: number, index: number) =>
          //                 index < 6 ? (
          //                   <span
          //                     key={emoji}
          //                     className="cursor-pointer"
          //                     onClick={(event) => handleReaction(event, emoji)}
          //                   >
          //                     {String.fromCodePoint(emoji)}
          //                   </span>
          //                 ) : null
          //               )}
          //             </div>
          //           ) : null}
          //         </span>
          //       ) : null}
          //     </div>
          //     {/* <div className="pl-4"><small className="text-gray-500">{formatDate(message.timestamp)}</small></div> */}
          //   </div>
          // </div>
          <>
            <div className="-intro-x chat-text-box flex items-end float-left mb-4">
              {/* avatar */}
<div className="chat-text-box__photo w-10 h-10 hidden sm:block flex-none image-fit relative mr-4">
{
  showAvatar && showAvatar === message.id && photoURL ? <Image
    src={photoURL}
    width={48}
    height={48}
    alt=""
    className="rounded-full"
  /> : null
}
</div>
<div className="w-full">
<div>
<div className="chat-text-box__content flex items-center float-left">
{/* Message action */}
<div className="hidden sm:block dropdown relative mr-3 mt-3">
<a href="javascript:;" className="dropdown-toggle w-4 h-4"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </a>
<div className="dropdown-menu w-40">
<div className="dropdown-menu__content box dark:bg-dark-1 p-2">
<a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-corner-up-left w-4 h-4 mr-2"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg> Reply </a>
<a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-trash w-4 h-4 mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete </a>
</div>
</div>
</div>
{/* Message content */}
<div className="box leading-relaxed dark:text-gray-300 text-gray-700 px-4 py-3 mt-3">{handleMessage()}</div>
<div className="hidden sm:block dropdown relative ml-3 mt-3">
<a href="javascript:;" className="dropdown-toggle w-4 h-4"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </a>
<div className="w-40">
<div className="box dark:bg-dark-1 p-2">
<a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-corner-up-left w-4 h-4 mr-2"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg> Reply </a>
<a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-trash w-4 h-4 mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete </a>
</div>
</div>
</div>
</div>
{/* <div className="clear-both"></div> */}
{/* image-message */}
{/* <div className="chat-text-box__content flex items-center float-left">
<div className="box text-gray-700 dark:text-gray-300 flex flex-col sm:flex-row items-center mt-3 p-3">
<div className="chat-text-box__content__icon text-white w-12 flex-none bg-contain relative bg-no-repeat bg-center block">
<div className="absolute m-auto top-0 left-0 right-0 bottom-0 flex items-center justify-center">JPG</div>
</div>
<div className="sm:ml-3 mt-3 sm:mt-0 text-center sm:text-left">
<div className="text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium">preview-8.jpg</div>
<div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">1.2 MB Image File</div>
</div>
<div className="sm:ml-20 mt-3 sm:mt-0 flex">
<a href="javascript:;" className="tooltip w-8 h-8 block border rounded-full flex-none flex items-center justify-center sm:ml-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-download w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> </a>
<a href="javascript:;" className="tooltip w-8 h-8 block border rounded-full flex-none flex items-center justify-center ml-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-share w-4 h-4"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg> </a>
<a href="javascript:;" className="tooltip w-8 h-8 block border rounded-full flex-none flex items-center justify-center ml-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-horizontal w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg> </a>
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
</div> */}
</div>
<div className="clear-both mb-2"></div>
{
  showAvatar && showAvatar === message.id ? <div className="text-gray-600 text-xs">{ <TimeAgo datetime={timestamp} /> }</div> : null
}
</div>
</div>
            <div className="clear-both"></div>
          </>
        )
      }
    </>
  );
}

const ReactionContainer = styled.div`
  border-radius: 50%;
  background-color: #fffdfd;
  color: silver;
  position: absolute;
  width: 25px;
  height: 25px;
  /* padding: 5px; */
  padding-bottom: 27px;
  text-align: center;
  align-items: center;
  /* margin-left: 30px; */
`;

const ReactionContainerReciever = styled(ReactionContainer)`
  left: 0;
  /* margin-left: 30px; */
`;

const ReactionContainerSender = styled(ReactionContainer)`
  right: 0;
  /* margin-left: 30px; */
`;
