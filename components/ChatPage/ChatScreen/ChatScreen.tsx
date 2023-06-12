import { auth, db, storage } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "../Message/Message";
import { useEffect, useRef, useState } from "react";
import getRecipientEmail from "@/utils/getRecipientEmail";
import { useRouter } from "next/router";
import firebase from "firebase";
import CallIcon from "@mui/icons-material/Call";
import VideocamIcon from "@mui/icons-material/Videocam";
import { IconButton, Modal } from "@mui/material";
import getEmojiData from "@/utils/getEmojiData";
import sendNotificationFCM from "@/utils/sendNotificationFCM";
import SendIcon from "@mui/icons-material/Send";
import Loading from "@/components/Loading";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import UserDetailScreen from "@/components/ProfilePage/UserDetailScreen/UserDetailScreen";
import TagFacesIcon from "@mui/icons-material/TagFaces";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import {
  EmojiContainer,
  EmojiElement,
  EndOfMessage,
  InputMessage,
} from "./ChatScreenStyled";
import { toast } from "react-toastify";
import {
  handleImageInMessage,
  onImageChange,
  pushUrlFileToFirestore,
  pushUrlImageToFirestore,
  sendNotification,
  setSeenMessage,
} from "../Functions";
import JSZip from "jszip";
import { randomUUID } from "crypto";

export default function ChatScreen({ chat, messages }: any) {
  const [user] = useAuthState(auth);
  const endOfMessageRef: any = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [statusSend, setStatusSend] = useState("");
  const [chatId, setChatId] = useState(chat.id);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {}, []);
  const [messageSnapShot] = useCollection(
    db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .orderBy("timestamp")
      .limitToLast(10)
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  useEffect(() => {
    // getRecipientUser().catch((err) => console.log(err))

    scrollToBottom();

    // socket.on('response-reject-call-one-to-one', (res: string) => {
    //     let data = JSON.parse(res);
    //     if(data.recipient === user?.email) {
    //         setIsOpen(false);
    //         // toast(`${data.name} rejected the call !`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
    //     }
    // });

    // socket.on("response-accept-call-one-to-one", (res: string) => {
    //     let data = JSON.parse(res);
    //     console.log(data.sender === user?.email)
    //     if(data.sender === user?.email) {
    //         setIsOpen(false);
    //         window.open(router.basePath + "/video-call/" + data.chatId);
    //     }
    // })

    // return () => {
    //     socket.disconnect()
    // }
  }, [messageSnapShot]);

  const scrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({ behavior: "smooth" });
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

  const showMessage = () => {
    if (messageSnapShot) {
      return messageSnapShot?.docs?.map((message: any) => (
        <Message
          key={message.id}
          message={{
            id: message.id,
            ...message.data(),
            timestamp: message?.timestamp?.toDate().getTime(),
          }}
          photoURL={getRecipientAvatar()}
          chatId={chatId}
        />
      ));
    } else {
      return messages?.docs?.map((message: any) => (
        <Message
          key={message.id}
          message={{
            id: message.id,
            ...message.data(),
            timestamp: message?.timestamp?.toDate().getTime(),
          }}
          photoURL={getRecipientAvatar()}
          chatId={chatId}
        />
      ));
    }
  };

  const sendMessage = async (e: any): Promise<any> => {
    setStatusSend("Sending...");
    e.preventDefault();

    let { listImage, message } = handleImageInMessage();

    setSeenMessage(messageSnapShot, messages, user?.email, chatId);

    const { messageDoc } = await addMessageToFirebase(
      message,
      listImage?.length! > 0 ? "text-image" : "text"
    );

    if (messageDoc) {
      const snap = await messageDoc.get();
      await Promise.all(
        Array.prototype.map.call(
          listImage,
          async (item: HTMLImageElement, index) => {
            const response = await fetch(item?.src);
            const blob = await response.blob();
            storage
              .ref(`public/images/message/${snap.id}/#img-msg-${index}`)
              .put(blob)
              .on(
                "state_changed",
                (snapshot) => {
                  const prog = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  );
                  setProgress(prog);
                },
                (err) => console.log(err),
                () => {
                  pushUrlImageToFirestore(
                    snap.id,
                    index,
                    chatId,
                    scrollToBottom
                  );
                }
              );
          }
        )
      );
      sendNotification(
        snap,
        chat,
        user?.displayName,
        recipientSnapshot?.docs?.[0]?.data().fcm_token
      );
    }

    const element = document.getElementById("input-message");
    if (element) element.innerHTML = "";

    scrollToBottom();
    setStatusSend("Sent");
  };

  const addMessageToFirebase = async (message: string, typeMessage: string) => {
    const messageDoc = await db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: message,
        user: user?.email,
        type: typeMessage,
        photoURL: "",
        seen: [],
      });
    return { messageDoc };
  };

  // const handleVideoCall = async() => {
  //     let userBusy = await getUserBusy();

  //     if(!isOpen) {

  //         if(userBusy.includes(recipientUser.email)) {

  //             toast(`${recipientUser.fullName} is busy`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
  //             return;

  //         } else {

  //             setIsOpen(true);
  //             // let listRecipient = chat.users.filter((email: any) => email !== user?.email);
  //             let data = {
  //                 sender: user?.email,
  //                 recipient: getRecipientEmail(chat.users, user),
  //                 chatId: chatId,
  //                 isGroup: chat.isGroup
  //             }
  //             socket.emit("call-video-one-to-one", JSON.stringify(data));
  //         }
  //     }

  //     return null;
  // }

  const addEmoji = (e: number) => {
    const inputMess = document.getElementById("input-message")?.innerHTML;
    document.getElementById("input-message")!.innerHTML =
      inputMess + String.fromCodePoint(e);
    setShowEmoji(false);
  };

  setSeenMessage(messageSnapShot, messages, user?.email, chatId);

  const onAttachFile = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      let file: Blob = event.target.files[0];
      let fileType = file.name.split(".").pop();
      let validImageTypes = [
        "jpg",
        "png",
        "dotx",
        "pdf",
        "mp3",
        "mp4",
        "csv",
        "xlsx",
        "txt",
        "docx",
        "dot",
        "eml",
        "html",
        "css",
        "js",
        "rar",
        "iso",
        "xml",
        "pptx",
        "zip",
        "exe",
      ];
      let fileSize = file.size / 1024 / 1024;
      if (!validImageTypes.includes(fileType ?? "")) {
        toast("File upload invalid !", {
          hideProgressBar: true,
          type: "error",
          autoClose: 5000,
        });
        return;
      }
      if (fileSize > 100) {
        toast("Size file no larger than 100 MB !", {
          hideProgressBar: true,
          type: "error",
          autoClose: 5000,
        });
        return;
      }
      let chunkSize = 5 * 1024 * 1024; // 5 MB chunk size
      let chunks = [];
      let start = 0;
      let end = chunkSize;
      while (start < file.size) {
        chunks.push(file.slice(start, end));
        start = end;
        end = start + chunkSize;
      }
      const { messageDoc } = await addMessageToFirebase("#file-msg-0", "file");
      await db
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .doc(messageDoc.id)
        .collection("fileInMessage")
        .add({
          key: "#file-msg-0",
          size: fileSize,
          name: file.name,
        });
      await Promise.all(
        Array.prototype.map.call(chunks, async (chunk: Blob, index) => {
          let key = `chunk-${index}`;
          storage
            .ref(`public/files/message/${messageDoc.id}/#file-msg-0/${key}`)
            .put(chunk)
            .on(
              "state_changed",
              (snapshot) => {
                const prog = Math.round(
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(prog);
              },
              (err) => console.log(err),
              () => {
                // pushUrlFileToFirestore(
                //   messageDoc.id,
                //   chatId,
                //   scrollToBottom,
                //   key,
                //   chunk.size,
                //   chunk.name
                // );
                storage
                  .ref(
                    `public/files/message/${messageDoc.id}/#file-msg-0/${key}`
                  )
                  .getDownloadURL()
                  .then(async (url) => {
                    await db
                      .collection("chats")
                      .doc(chatId)
                      .collection("messages")
                      .doc(messageDoc.id)
                      .collection("fileInMessage")
                      .add({
                        url: url,
                        key: key,
                        size: chunk.size,
                      });
                    scrollToBottom();
                  })
                  .catch((err) => console.log(err));
              }
            );
        })
      );
    }
  };

  return (
    //     <VideoCallContainer isOpen={isOpen} >
    //         <VideoCallScreen statusCall='Calling' photoURL={chat.isGroup ? chat.photoURL : recipientUser.photoURL} sender={user?.email} recipient={getRecipientEmail(chat.users, user)} chatId={chatId} onClose={() => setIsOpen(false)} isGroup={chat.isGroup} />
    //     </VideoCallContainer>
    <>
      <Loading isShow={isLoading} />
      <div className="chat-area flex-1 flex flex-col relative">
        <div className="flex-3">
          <h2 className="text-xl pb-1 mb-4 border-b-2 border-gray-200 d-flex">
            {chat.isGroup ? "Chatting in group " : "Chatting with "}&nbsp;
            {!chat.isGroup ? (
              <div
                onClick={() => setIsOpen(true)}
                className="cursor-pointer font-semibold"
                id="hover-animation"
                data-replace="Profile"
              >
                <span>{recipientSnapshot?.docs?.[0].data().fullName}</span>
              </div>
            ) : (
              <span>{chat.name}</span>
            )}
            <div className="ml-auto">
              <IconButton>
                <VideocamIcon fontSize="small" />
              </IconButton>
              <IconButton>
                <CallIcon fontSize="small" />
              </IconButton>
            </div>
          </h2>
        </div>
        <div className="messages flex-1 overflow-auto h-screen px-4">
          {showMessage()}
          {statusSend.length > 0 ? (
            <span className="float-right pr-2">
              {statusSend}
              &nbsp;
              {statusSend === "Sending..." ? null : (
                <DoneAllIcon fontSize="small" />
              )}
            </span>
          ) : null}
          <EndOfMessage
            ref={(el) => {
              endOfMessageRef.current = el;
            }}
          />
        </div>
        <div className="pt-4 pb-10">
          <div className="write bg-white shadow flex rounded-lg">
            <div
              className="text-center pt-4 pl-4 cursor-pointer"
              onClick={() => setShowEmoji(!showEmoji)}
            >
              <span className="text-gray-400 hover:text-gray-800">
                <span className="align-text-bottom">
                  <TagFacesIcon fontSize="small" />
                </span>
              </span>
            </div>
            <div className="flex-1">
              <InputMessage
                contentEditable="true"
                className="w-full block outline-none py-4 px-4 bg-transparent"
                style={{ maxHeight: "160px" }}
                onClick={() => setSeenMessage}
                id="input-message"
                placeholder="Type message..."
              />
            </div>

            <div className="p-2 flex content-center items-center">
              <div
                className="text-center p-2 cursor-pointer"
                onClick={() => sendMessage}
              >
                <span className="text-gray-400 hover:text-gray-800">
                  <span className="align-text-bottom">
                    <input
                      type="file"
                      hidden
                      id="upload-image"
                      onChange={onImageChange}
                      multiple
                    />
                    <InsertPhotoIcon
                      fontSize="small"
                      onClick={() =>
                        document.getElementById("upload-image")?.click()
                      }
                    />
                  </span>
                </span>
              </div>
              <div
                className="text-center p-2 cursor-pointer"
                onClick={() => sendMessage}
              >
                <span className="text-gray-400 hover:text-gray-800">
                  <span className="align-text-bottom">
                    <input
                      type="file"
                      hidden
                      id="upload-file"
                      onChange={onAttachFile}
                    />
                    <AttachFileIcon
                      fontSize="small"
                      onClick={() =>
                        document.getElementById("upload-file")?.click()
                      }
                    />
                  </span>
                </span>
              </div>
              <div className="text-center cursor-pointer p-2">
                <span
                  className="text-indigo-500 hover:text-gray-800"
                  onClick={(event) => sendMessage(event)}
                >
                  <span className="align-text-bottom">
                    <SendIcon />
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
        {showEmoji ? (
          <EmojiContainer>
            {getEmojiData.map((e: any) => (
              <EmojiElement onClick={() => addEmoji(e)} key={e}>
                {String.fromCodePoint(e)}
              </EmojiElement>
            ))}
          </EmojiContainer>
        ) : null}
      </div>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <UserDetailScreen userInfo={recipientSnapshot?.docs?.[0].data()} />
      </Modal>
    </>
  );
}
