import { auth, db, storage } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { CustomAvatar } from "../ChatComponent";
import styled from "styled-components";
import { lazy, useEffect, useState } from "react";
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
import SenderTemplateText from "./SenderTemplateText";
import { MapImageAttachData } from "@/types/ImageAttachType";
import SenderTemplateImage from "./SenderTemplateImage";
import RecieverTemplateText from "./RecieverTemplateText";
import RecieverTemplateImage from "./RecieverTemplateImage";
import ShowImageFullScreen from "./ShowImageFullScreen";
import SenderTemplateTextImage from "./SenderTemplateTextImage";
import RecieverTemplateTextImage from "./RecieverTemplateTextImage";
import { MapImageInMessageData } from "@/types/ImageInMessageType";

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
  const [isShowImageFullscreen, setShowImageFullscreen] = useState(false);
  const [urlImage, setUrlImage] = useState("");
  const formatDate = (dt: any)  => {
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

  const [imageAttachSnap] = useCollection(
    db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .doc(message.id)
      .collection("imageAttach")
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
    // fileInMessageSnap?.docs?.forEach((doc) => {
    //   fetch(doc.data().url)
    //   .then((response) => response.blob())
    //   .then((blob) => {
    //     console.log(blob);
    //   })
    // })
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
        message.user === userLoggedIn?.email ? 
          <>
            {
              message.type === "text" ? <SenderTemplateText message={message} showAvatar={showAvatar} photoURL={userLoggedIn.photoURL} timestamp={timestamp} /> : null
            }
            {
              message.type === "text-image" ? <SenderTemplateTextImage imgs={imageInMessageSnap?.docs?.map((doc) => MapImageInMessageData(doc))!} message={message} showAvatar={showAvatar!} photoURL={userLoggedIn.photoURL!} timestamp={timestamp} /> : null
            }
            {/* {
              message.type === "file" ? <SenderTemplateText message={message} showAvatar={showAvatar} photoURL={userLoggedIn.photoURL} timestamp={timestamp} /> : null
            } */}
            {
              message.type === "image" ? <SenderTemplateImage imgs={imageAttachSnap?.docs.map((doc) => MapImageAttachData(doc))} message={message} showAvatar={showAvatar} photoURL={userLoggedIn.photoURL} timestamp={timestamp} onShowImage={(urlImage: any) => {setUrlImage(urlImage);setShowImageFullscreen(true)}} /> : null
            }
          </> : 
          <>
            {
              message.type === "text" ? <RecieverTemplateText message={message} showAvatar={showAvatar} photoURL={userLoggedIn?.photoURL} timestamp={timestamp} /> : null
            }
            {
              message.type === "text-image" ? <RecieverTemplateTextImage imgs={imageInMessageSnap?.docs?.map((doc) => MapImageInMessageData(doc))!} message={message} showAvatar={showAvatar} photoURL={userLoggedIn?.photoURL} timestamp={timestamp} /> : null
            }
            {/* {
              message.type === "file" ? <SenderTemplateText message={message} showAvatar={showAvatar} photoURL={userLoggedIn.photoURL} timestamp={timestamp} /> : null
            } */}
            {
              message.type === "image" ? <RecieverTemplateImage imgs={imageAttachSnap?.docs.map((doc) => MapImageAttachData(doc))} message={message} showAvatar={showAvatar} photoURL={userLoggedIn?.photoURL!} timestamp={timestamp} /> : null
            }
          </>
      }
      {
        isShowImageFullscreen ? <ShowImageFullScreen urlImage={urlImage} onHide={() => setShowImageFullscreen(!ShowImageFullScreen)} /> : null
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
