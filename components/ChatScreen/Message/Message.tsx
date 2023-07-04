import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import sendNotificationFCM from "@/utils/sendNotificationFCM";
import { MessageType } from "@/types/MessageType";
import firebase from "firebase";
import SenderTemplateText from "./SenderTemplate/SenderTemplateText";
import { MapImageAttachData } from "@/types/ImageAttachType";
import SenderTemplateImage from "./SenderTemplate/SenderTemplateImage";
import RecieverTemplateText from "./RecieverTemplate/RecieverTemplateText";
import RecieverTemplateImage from "./RecieverTemplate/RecieverTemplateImage";
import ShowImageFullScreen from "./ShowImageFullScreen";
import SenderTemplateTextImage from "./SenderTemplate/SenderTemplateTextImage";
import RecieverTemplateTextImage from "./RecieverTemplate/RecieverTemplateTextImage";
import { MapImageInMessageData } from "@/types/ImageInMessageType";
import SenderTemplateFile from "./SenderTemplate/SenderTemplateFile";
import { MapFileInMessageData } from "@/types/FileInMessageType";
import RecieverTemplateFile from "./RecieverTemplate/RecieverTemplateFile";

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

  // const [reactionSnapshot] = useCollection(
  //   db
  //     .collection("chats")
  //     .doc(chatId)
  //     .collection("messages")
  //     .doc(message.id)
  //     .collection("reaction")
  //     .orderBy("timestamp")
  //     .limitToLast(1)
  // );

  // const [recipientSnapshot] = useCollection(
  //   db.collection("users").where("email", "==", message.user)
  // );

  // const handleReaction = async (event: any, emoji: number) => {
  //   event.preventDefault();
  //   try {
  //     await db
  //       .collection("chats")
  //       .doc(chatId)
  //       .collection("messages")
  //       .doc(message.id)
  //       .collection("reaction")
  //       .add({
  //         senderEmail: userLoggedIn?.email,
  //         emoji: String.fromCodePoint(emoji),
  //         timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  //       });
  //     await sendNotificationFCM(
  //       "Notification",
  //       userLoggedIn?.displayName +
  //         " dropped an emotion " +
  //         String.fromCodePoint(emoji) +
  //         " into your message",
  //       recipientSnapshot?.docs?.[0]?.data().fcm_token
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   setIsShown(false);
  // };

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
      .limit(1)
  );

  const [imageAttachSnap] = useCollection(
    db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .doc(message.id)
      .collection("imageAttach")
  );

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
              message.type === "text-image" ? <SenderTemplateTextImage message={message} timestamp={new Date(timestamp).getTime()} lastIndex={lastIndex} scrollToBottom={() => scrollToBottom()} /> : null
            }
            {
              message.type === "file" ? <SenderTemplateFile file={message} lastIndex={lastIndex} /> : null
            }
            {
              message.type === "image" ? <SenderTemplateImage imgs={imageAttachSnap?.docs.map((image) => MapImageAttachData(image))} timestamp={new Date(timestamp).getTime()} onShowImage={(urlImage: any) => {setUrlImage(urlImage);setShowImageFullscreen(true)}} lastIndex={lastIndex} /> : null
            }
          </> : 
          <>
            {
              message.type === "text" ? <RecieverTemplateText message={message} timestamp={timestamp.toDate()} lastIndex={lastIndex} /> : null
            }
            {
              message.type === "text-image" ? <RecieverTemplateTextImage message={message} timestamp={new Date(timestamp).getTime()} lastIndex={lastIndex} /> : null
            }
            {
              message.type === "file" ? <RecieverTemplateFile file={message} lastIndex={lastIndex} /> : null
            }
            {
              message.type === "image" ? <RecieverTemplateImage imgs={imageAttachSnap?.docs.map((image) => MapImageAttachData(image))} timestamp={new Date(timestamp).getTime()} lastIndex={lastIndex} onShowImage={(urlImage: any) => {setUrlImage(urlImage);setShowImageFullscreen(true)}} /> : null
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
