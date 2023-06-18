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
import SenderTemplateFile from "./SenderTemplateFile";
import { MapFileInMessageData } from "@/types/FileInMessageType";
import { MapChunkFileData } from "@/types/ChunkFileType";

export default function Message({
  message,
  timestamp,
  chatId,
  lastIndex,
  scrollToBottom
}: {
  message: MessageType;
  timestamp: any;
  chatId: string;
  lastIndex: boolean;
  scrollToBottom: any
}) {
  const [userLoggedIn] = useAuthState(auth);
  const [isShown, setIsShown] = useState(false);
  const [isShowImageFullscreen, setShowImageFullscreen] = useState(false);
  const [urlImage, setUrlImage] = useState("");

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

  const [chunks] = useCollection(
    db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .doc(message.id)
      .collection("fileInMessage")
      .doc(fileInMessageSnap?.docs?.[0].id).collection("chunks")
  );

  const [imageAttachSnap] = useCollection(
    db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .doc(message.id)
      .collection("imageAttach")
  );

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
              message.type === "text" ? <SenderTemplateText message={message} timestamp={timestamp} lastIndex={lastIndex} /> : null
            }
            {
              message.type === "text-image" ? <SenderTemplateTextImage imgs={imageInMessageSnap?.docs?.map((doc) => MapImageInMessageData(doc))!} message={message} timestamp={new Date(timestamp).getTime()} lastIndex={lastIndex} scrollToBottom={() => scrollToBottom()} /> : null
            }
            {
              message.type === "file" ? <SenderTemplateFile file={MapFileInMessageData(fileInMessageSnap?.docs?.[0]!)} chunks={chunks?.docs.map((chunk) => MapChunkFileData(chunk))!} message={message} chatId={chatId} lastIndex={lastIndex} timestamp={new Date(timestamp).getTime()} /> : null
            }
            {
              message.type === "image" ? <SenderTemplateImage imgs={imageAttachSnap?.docs.map((doc) => MapImageAttachData(doc))} timestamp={new Date(timestamp).getTime()} onShowImage={(urlImage: any) => {setUrlImage(urlImage);setShowImageFullscreen(true)}} lastIndex={lastIndex} /> : null
            }
          </> : 
          <>
            {
              message.type === "text" ? <RecieverTemplateText message={message} timestamp={new Date(timestamp).getTime()} lastIndex={lastIndex} /> : null
            }
            {
              message.type === "text-image" ? <RecieverTemplateTextImage imgs={imageInMessageSnap?.docs?.map((doc) => MapImageInMessageData(doc))!} message={message} timestamp={new Date(timestamp).getTime()} lastIndex={lastIndex} /> : null
            }

            {
              message.type === "image" ? <RecieverTemplateImage imgs={imageAttachSnap?.docs.map((doc) => MapImageAttachData(doc))} timestamp={new Date(timestamp).getTime()} lastIndex={lastIndex} onShowImage={(urlImage: any) => {setUrlImage(urlImage);setShowImageFullscreen(true)}} /> : null
            }
          </>
      }
      {
        isShowImageFullscreen ? <ShowImageFullScreen urlImage={urlImage} onHide={() => setShowImageFullscreen(!ShowImageFullScreen)} chatId={chatId} /> : null
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
