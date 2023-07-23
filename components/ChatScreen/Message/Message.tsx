import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { useState } from "react";
import { MessageType } from "@/types/MessageType";
import SenderTemplateText from "./SenderTemplate/SenderTemplateText";
import SenderTemplateImage from "./SenderTemplate/SenderTemplateImage";
import RecieverTemplateText from "./RecieverTemplate/RecieverTemplateText";
import RecieverTemplateImage from "./RecieverTemplate/RecieverTemplateImage";
import SenderTemplateFile from "./SenderTemplate/SenderTemplateFile";
import RecieverTemplateFile from "./RecieverTemplate/RecieverTemplateFile";
import { useSelector, useDispatch } from 'react-redux'
import { selectChatState } from "@/redux/chatSlice";
import { selectAppState } from "@/redux/appSlice";
import { ChatType } from "@/types/ChatType";
import { updateMessage } from "@/services/MessageService";
import { updateMessageInListChat } from "@/services/CacheService";
export default function Message({
  message,
  chat,
  lastIndex,
  scrollToBottom,
  showAvatar
}: {
  message: MessageType;
  chat: ChatType;
  lastIndex: boolean;
  scrollToBottom: any;
  showAvatar: boolean
}) {
  const [userLoggedIn] = useAuthState(auth);
  const [isShown, setIsShown] = useState(false);
  const [isShowImageFullscreen, setShowImageFullscreen] = useState(false);
  const [urlImage, setUrlImage] = useState("");
  const chatState = useSelector(selectChatState)
  const appState = useSelector(selectAppState)
  const dispatch = useDispatch()
  // const [reactionSnapshot] = useCollection(
  //   db
  //     .collection("chats")
  //     .doc(chatId)
  //     .collection("messages")
  //     .doc(message._id)
  //     .collection("reaction")
  //     .orderBy("timestamp")
  //     .limitToLast(1)
  // );

  // const [recipientSnapshot] = useCollection(
  //   db.collection("users").where("email", "==", message.user)
  // );

  function _delete(obj: any, prop: any) {
    if (obj[prop] && ! obj[prop].length) delete obj[prop];
  }

  const handleReaction = (event: any, emoji: number) => {
    event.preventDefault();
    let messageExist = message

    if (message.reaction?.length! > 0) {
      let reaction = JSON.parse(message.reaction!)
      let emojiExist = reaction?.find((reac: any) => reac.emoji === emoji)   
      if (emojiExist) {
        reaction = reaction.map((react: any) => {
          if (react.emoji === emoji) {
            return {
              ...react,
              amount: react?.amount + 1
            }
          }
          else return react
        })
        updateMessage({
          ...messageExist,
          reaction: JSON.stringify(reaction)
        }).then((data: MessageType) => {
          updateMessageInListChat(chat._id!, data, data._id!, dispatch)
        })
      } else {
        reaction.push({
          senderId: appState.userInfo._id,
          emoji: emoji,
          amount: 1
        })
        updateMessage({
          ...messageExist,
          reaction: JSON.stringify(reaction)
        }).then((data: MessageType) => {
          updateMessageInListChat(chat._id!, data, data._id!, dispatch)
        })
      }
    } else {
      updateMessage({
        ...messageExist,
        reaction: JSON.stringify([{
          senderId: appState.userInfo._id,
          emoji: emoji,
          amount: 1
        }])
      }).then((data: MessageType) => {
        updateMessageInListChat(chat._id!, data, data._id!, dispatch)
      })
    }
    console.log(chatState.listChat)
  };

  return (
    <>
      {
        // Sender
        message.senderId === appState.userInfo._id ? 
          <>
            {
              message.type === "text" ? <SenderTemplateText 
              message={message} 
              timestamp={message.createdAt} 
              lastIndex={lastIndex}
              handleReaction={handleReaction} /> : null
            }
            {
              message.type === "file" || message.type === "file-uploading" ? <SenderTemplateFile 
              message={message}
              lastIndex={lastIndex} 
              timestamp={message.createdAt} 
              type={message.type}
              handleReaction={handleReaction} /> : null
            }
            {
              message.type === "image" ? <SenderTemplateImage 
              message={message.message!} 
              timestamp={message.createdAt} 
              onShowImage={(urlImage: any) => {setUrlImage(urlImage);setShowImageFullscreen(true)}} 
              lastIndex={lastIndex} 
              scroll={scrollToBottom}
              handleReaction={handleReaction} /> : null
            }
          </> : 
          <>
            {
              message.type === "text" ? <RecieverTemplateText 
              chat={chat}
              message={message} 
              timestamp={message.createdAt} 
              lastIndex={lastIndex}
              showAvatar={showAvatar}
              handleReaction={handleReaction} /> : null
            }
            {
              message.type === "file" ? <RecieverTemplateFile 
              chat={chat}
              message={message}
              lastIndex={lastIndex} 
              timestamp={message.createdAt}
              showAvatar={showAvatar}
              handleReaction={handleReaction} /> : null
            }
            {
              message.type === "image" ? <RecieverTemplateImage 
              chat={chat}
              message={message} 
              timestamp={message.createdAt} 
              lastIndex={lastIndex} 
              onShowImage={(urlImage: any) => {setUrlImage(urlImage);setShowImageFullscreen(true)}}
              scroll={scrollToBottom}
              showAvatar={showAvatar}
              handleReaction={handleReaction} /> : null
            }
          </>
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
