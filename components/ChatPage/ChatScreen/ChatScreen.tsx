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
import { useSelector } from 'react-redux';
import { selectAppState } from "@/redux/appSlice";

export default function ChatScreen({ chat }: any) {
  const [user] = useAuthState(auth);
  const endOfMessageRef: any = useRef(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const [statusSend, setStatusSend] = useState("");
  const [chatId, setChatId] = useState(chat.id);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const appState = useSelector(selectAppState)

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

    // scrollToBottom();

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
    }
  };

  const sendMessage = async (e: any): Promise<any> => {
    setStatusSend("Sending...");
    e.preventDefault();

    let { listImage, message } = handleImageInMessage();

    setSeenMessage(messageSnapShot, user?.email, chatId);

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

  setSeenMessage(messageSnapShot, user?.email, chatId);

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
      {/* <Loading isShow={isLoading} />
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
      </Modal> */}
      <div className="chat-box border-theme-5 col-span-12 xl:col-span-6 flex flex-col overflow-hidden xl:border-l xl:border-r p-6">
        <div className="intro-y box border border-theme-3 dark:bg-dark-2 dark:border-dark-2 flex items-center px-5 py-4">
          <div className="flex items-center mr-auto">
            <div className="w-12 h-12 flex-none image-fit mr-1">
              <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-full" src="https://topson.left4code.com/dist/images/profile-9.jpg"/>
              <div className="bg-green-500 w-3 h-3 absolute right-0 top-0 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-2 overflow-hidden">
              <a href="javascript:;" className="text-base font-medium">{recipientSnapshot?.docs?.[0].data().fullName}</a>
              <div className="text-gray-600">
                {appState.userOnline.find((userOn) => userOn === recipientSnapshot?.docs?.[0]?.data()?.email)}
              </div>
            </div>
          </div>
          <a className="text-gray-600 hover:text-theme-1" href=""> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-camera w-4 h-4 sm:w-6 sm:h-6"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> </a>
          <a className="text-gray-600 hover:text-theme-1 ml-2 sm:ml-5" href=""> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-mic w-4 h-4 sm:w-6 sm:h-6"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg> </a>
        </div>
        <div className="overflow-y-scroll scrollbar-hidden pt-5 flex-1">
        {showMessage()}
        {/* <div className="-intro-x chat-text-box flex items-end float-left mb-4">
        <div className="chat-text-box__photo w-10 h-10 hidden sm:block flex-none image-fit relative mr-4">
        <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-full" src="https://topson.left4code.com/dist/images/profile-9.jpg"/>
        </div>
        <div className="w-full">
        <div>
        <div className="chat-text-box__content flex items-center float-left">
        <div className="box leading-relaxed dark:text-gray-300 text-gray-700 px-4 py-3 mt-3"> Lorem ipsum sit amen dolor, lorem ipsum sit amen dolor </div>
        <div className="hidden sm:block dropdown relative ml-3 mt-3">
        <a href="javascript:;" className="dropdown-toggle w-4 h-4"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </a>
        <div className="dropdown-menu w-40">
        <div className="dropdown-menu__content box dark:bg-dark-1 p-2">
        <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-corner-up-left w-4 h-4 mr-2"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg> Reply </a>
        <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-trash w-4 h-4 mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete </a>
        </div>
        </div>
        </div>
        </div>
        <div className="clear-both"></div>
        <div className="chat-text-box__content flex items-center float-left">
        <div className="rounded-md text-gray-700 chat-text-box__content__text--image flex justify-end mt-3">
        <div className="tooltip w-16 h-16 image-fit zoom-in">
        <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-md" src="https://topson.left4code.com/dist/images/preview-4.jpg"/>
        </div>
        <div className="tooltip w-16 h-16 image-fit ml-2 zoom-in">
        <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-md" src="https://topson.left4code.com/dist/images/preview-12.jpg"/>
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
        </div>
        <div className="clear-both"></div>
        <div className="chat-text-box__content flex items-center float-left">
        <div className="box leading-relaxed dark:text-gray-300 text-gray-700 px-4 py-3 mt-3"> Contrary to popular belief </div>
        <div className="hidden sm:block dropdown relative ml-3 mt-3">
        <a href="javascript:;" className="dropdown-toggle w-4 h-4"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </a>
        <div className="dropdown-menu w-40">
        <div className="dropdown-menu__content box dark:bg-dark-1 p-2">
        <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-corner-up-left w-4 h-4 mr-2"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg> Reply </a>
        <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-trash w-4 h-4 mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete </a>
        </div>
        </div>
        </div>
        </div>
        </div>
        <div className="clear-both mb-2"></div>
        <div className="text-gray-600 text-xs">10 secs ago</div>
        </div>
        </div>
        <div className="clear-both"></div>
        <div className="intro-x chat-text-box flex items-end float-right mb-4">
        <div className="w-full">
        <div>
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
        <div className="box leading-relaxed bg-theme-1 text-opacity-80 text-white px-4 py-3 mt-3"> Lorem ipsum </div>
        </div>
        <div className="clear-both"></div>
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
        <div className="box leading-relaxed text-gray-700 dark:text-gray-300 flex flex-col sm:flex-row items-center mt-3 p-3">
        <div className="chat-text-box__content__icon text-white w-12 flex-none bg-contain relative bg-no-repeat bg-center block">
        <div className="absolute m-auto top-0 left-0 right-0 bottom-0 flex items-center justify-center">PNG</div>
        </div>
        <div className="sm:ml-3 mt-3 sm:mt-0 text-center sm:text-left">
        <div className="text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium">preview-10.jpg</div>
        <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">1.4 MB Image File</div>
        </div>
        <div className="sm:ml-20 mt-3 sm:mt-0 flex">
        <a href="javascript:;" className="tooltip w-8 h-8 block border rounded-full flex-none flex items-center justify-center ml-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-download w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> </a>
        <a href="javascript:;" className="tooltip w-8 h-8 block border rounded-full flex-none flex items-center justify-center ml-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-share w-4 h-4"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg> </a>
        <a href="javascript:;" className="tooltip w-8 h-8 block border rounded-full flex-none flex items-center justify-center ml-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-more-horizontal w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg> </a>
        </div>
        </div>
        </div>
        </div>
        <div className="clear-both mb-2"></div>
        <div className="text-gray-600 text-xs text-right">1 secs ago</div>
        </div>
        <div className="chat-text-box__photo w-10 h-10 hidden sm:block flex-none image-fit relative ml-4">
        <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-full" src="https://topson.left4code.com/dist/images/profile-1.jpg"/>
        </div>
        </div>
        <div className="clear-both"></div>
        <div className="-intro-x chat-text-box flex items-end float-left mb-4">
        <div className="w-10 h-10 hidden sm:block flex-none image-fit relative mr-5">
        <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-full" src="https://topson.left4code.com/dist/images/profile-9.jpg"/>
        </div>
        <div className="w-full">
        <div>
        <div className="chat-text-box__content flex items-center float-left">
        <div className="box leading-relaxed dark:text-gray-300 text-gray-700 px-4 py-3 mt-3">
        John Travolta is typing
        <span className="typing-dots ml-1"> <span>.</span> <span>.</span> <span>.</span> </span>
        </div>
        </div>
        </div>
        </div>
        </div> */}
        </div>
        <div className="intro-y chat-input box border-theme-3 dark:bg-dark-2 dark:border-dark-2 border flex items-center px-5 py-4">
        <div className="dropdown relative" data-placement="top">
        <a href="javascript:;" className="text-gray-600 hover:text-theme-1 dropdown-toggle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-plus w-5 h-5 sm:w-6 sm:h-6"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> </a>
        <div className="chat-input__dropdown dropdown-menu">
        <div className="dropdown-menu__content p-2">
        <a href="" className="shadow-md text-gray-600 bg-white rounded-full dark:text-gray-300 dark:bg-dark-3 hover:bg-theme-1 hover:text-white dark:hover:bg-theme-1 flex items-center block p-3 transition duration-300 rounded-md mb-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-camera w-5 h-5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> </a>
        <a href="" className="shadow-md text-gray-600 bg-white rounded-full dark:text-gray-300 dark:bg-dark-3 hover:bg-theme-1 hover:text-white dark:hover:bg-theme-1 flex items-center block p-3 transition duration-300 rounded-md mb-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-mic w-5 h-5"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg> </a>
        <a href="" className="shadow-md text-gray-600 bg-white rounded-full dark:text-gray-300 dark:bg-dark-3 hover:bg-theme-1 hover:text-white dark:hover:bg-theme-1 flex items-center block p-3 transition duration-300 rounded-md mb-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-mail w-5 h-5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> </a>
        </div>
        </div>
        </div>
        <textarea className="form-control h-12 shadow-none resize-none border-transparent px-5 py-3 focus:shadow-none truncate mr-3 sm:mr-0" rows={1} placeholder="Type your message..."></textarea>
        <div className="dropdown relative mr-3 sm:mr-5" data-placement="top-end">
        <a href="javascript:;" className="text-gray-600 hover:text-theme-1 dropdown-toggle w-4 h-4 sm:w-5 sm:h-5 block"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-smile w-full h-full"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg> </a>
        <div className="chat-input__smiley dropdown-menu">
        <div className="dropdown-menu__content box dark:text-gray-300 dark:bg-dark-3 shadow-md">
        <div className="chat-input__smiley__box flex flex-col pb-3 -mt-2">
        <div className="px-3 pt-5">
        <div className="relative">
        <input type="text" className="form-control bg-gray-200 border-transparent pr-10" placeholder="Search emojis..."/>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-search w-5 h-5 absolute my-auto inset-y-0 mr-3 right-0"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        </div>
        <div className="chat-input__smiley__box__tabs text-gray-600 nav nav-tabs flex px-3 mt-5" role="tablist">
        <a data-toggle="tab" data-target="#history" href="javascript:;" className="py-2 flex justify-center flex-1 rounded hover:bg-gray-200 dark:hover:bg-dark-2 active" id="history-tab" role="tab" aria-controls="history" aria-selected="true">
        <svg className="w-4 h-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="currentColor" d="M504 255.531c.253 136.64-111.18 248.372-247.82 248.468-59.015.042-113.223-20.53-155.822-54.911-11.077-8.94-11.905-25.541-1.839-35.607l11.267-11.267c8.609-8.609 22.353-9.551 31.891-1.984C173.062 425.135 212.781 440 256 440c101.705 0 184-82.311 184-184 0-101.705-82.311-184-184-184-48.814 0-93.149 18.969-126.068 49.932l50.754 50.754c10.08 10.08 2.941 27.314-11.313 27.314H24c-8.837 0-16-7.163-16-16V38.627c0-14.254 17.234-21.393 27.314-11.314l49.372 49.372C129.209 34.136 189.552 8 256 8c136.81 0 247.747 110.78 248 247.531zm-180.912 78.784l9.823-12.63c8.138-10.463 6.253-25.542-4.21-33.679L288 256.349V152c0-13.255-10.745-24-24-24h-16c-13.255 0-24 10.745-24 24v135.651l65.409 50.874c10.463 8.137 25.541 6.253 33.679-4.21z"></path>
        </svg>
        </a>
        <a data-toggle="tab" data-target="#smile" href="javascript:;" className="py-2 flex justify-center flex-1 rounded hover:bg-gray-200 dark:hover:bg-dark-2" id="smile-tab" role="tab" aria-controls="smile" aria-selected="false">
        <svg className="w-4 h-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512">
        <path fill="currentColor" d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z"></path>
        </svg>
        </a>
        <a data-toggle="tab" data-target="#cat" href="javascript:;" className="py-2 flex justify-center flex-1 rounded hover:bg-gray-200 dark:hover:bg-dark-2" id="cat-tab" role="tab" aria-controls="cat" aria-selected="false">
        <svg className="w-4 h-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="currentColor" d="M290.59 192c-20.18 0-106.82 1.98-162.59 85.95V192c0-52.94-43.06-96-96-96-17.67 0-32 14.33-32 32s14.33 32 32 32c17.64 0 32 14.36 32 32v256c0 35.3 28.7 64 64 64h176c8.84 0 16-7.16 16-16v-16c0-17.67-14.33-32-32-32h-32l128-96v144c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V289.86c-10.29 2.67-20.89 4.54-32 4.54-61.81 0-113.52-44.05-125.41-102.4zM448 96h-64l-64-64v134.4c0 53.02 42.98 96 96 96s96-42.98 96-96V32l-64 64zm-72 80c-8.84 0-16-7.16-16-16s7.16-16 16-16 16 7.16 16 16-7.16 16-16 16zm80 0c-8.84 0-16-7.16-16-16s7.16-16 16-16 16 7.16 16 16-7.16 16-16 16z"></path>
        </svg>
        </a>
        <a data-toggle="tab" data-target="#coffee" href="javascript:;" className="py-2 flex justify-center flex-1 rounded hover:bg-gray-200 dark:hover:bg-dark-2" id="coffee-tab" role="tab" aria-controls="coffee" aria-selected="false">
        <svg className="w-4 h-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
        <path fill="currentColor" d="M192 384h192c53 0 96-43 96-96h32c70.6 0 128-57.4 128-128S582.6 32 512 32H120c-13.3 0-24 10.7-24 24v232c0 53 43 96 96 96zM512 96c35.3 0 64 28.7 64 64s-28.7 64-64 64h-32V96h32zm47.7 384H48.3c-47.6 0-61-64-36-64h583.3c25 0 11.8 64-35.9 64z"></path>
        </svg>
        </a>
        <a data-toggle="tab" data-target="#futbol" href="javascript:;" className="py-2 flex justify-center flex-1 rounded hover:bg-gray-200 dark:hover:bg-dark-2" id="futbol-tab" role="tab" aria-controls="futbol" aria-selected="false">
        <svg className="w-4 h-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zm-48 0l-.003-.282-26.064 22.741-62.679-58.5 16.454-84.355 34.303 3.072c-24.889-34.216-60.004-60.089-100.709-73.141l13.651 31.939L256 139l-74.953-41.525 13.651-31.939c-40.631 13.028-75.78 38.87-100.709 73.141l34.565-3.073 16.192 84.355-62.678 58.5-26.064-22.741-.003.282c0 43.015 13.497 83.952 38.472 117.991l7.704-33.897 85.138 10.447 36.301 77.826-29.902 17.786c40.202 13.122 84.29 13.148 124.572 0l-29.902-17.786 36.301-77.826 85.138-10.447 7.704 33.897C442.503 339.952 456 299.015 456 256zm-248.102 69.571l-29.894-91.312L256 177.732l77.996 56.527-29.622 91.312h-96.476z"></path>
        </svg>
        </a>
        <a data-toggle="tab" data-target="#building" href="javascript:;" className="py-2 flex justify-center flex-1 rounded hover:bg-gray-200 dark:hover:bg-dark-2" id="building-tab" role="tab" aria-controls="building" aria-selected="false">
        <svg className="w-4 h-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <path fill="currentColor" d="M128 148v-40c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-40c-6.6 0-12-5.4-12-12zm140 12h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm-128 96h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm128 0h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm-76 84v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12zm76 12h40c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12zm180 124v36H0v-36c0-6.6 5.4-12 12-12h19.5V24c0-13.3 10.7-24 24-24h337c13.3 0 24 10.7 24 24v440H436c6.6 0 12 5.4 12 12zM79.5 463H192v-67c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v67h112.5V49L80 48l-.5 415z"></path>
        </svg>
        </a>
        <a data-toggle="tab" data-target="#lightbulb" href="javascript:;" className="py-2 flex justify-center flex-1 rounded hover:bg-gray-200 dark:hover:bg-dark-2" id="lightbulb-tab" role="tab" aria-controls="lightbulb" aria-selected="false">
        <svg className="w-4 h-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512">
        <path fill="currentColor" d="M176 80c-52.94 0-96 43.06-96 96 0 8.84 7.16 16 16 16s16-7.16 16-16c0-35.3 28.72-64 64-64 8.84 0 16-7.16 16-16s-7.16-16-16-16zM96.06 459.17c0 3.15.93 6.22 2.68 8.84l24.51 36.84c2.97 4.46 7.97 7.14 13.32 7.14h78.85c5.36 0 10.36-2.68 13.32-7.14l24.51-36.84c1.74-2.62 2.67-5.7 2.68-8.84l.05-43.18H96.02l.04 43.18zM176 0C73.72 0 0 82.97 0 176c0 44.37 16.45 84.85 43.56 115.78 16.64 18.99 42.74 58.8 52.42 92.16v.06h48v-.12c-.01-4.77-.72-9.51-2.15-14.07-5.59-17.81-22.82-64.77-62.17-109.67-20.54-23.43-31.52-53.15-31.61-84.14-.2-73.64 59.67-128 127.95-128 70.58 0 128 57.42 128 128 0 30.97-11.24 60.85-31.65 84.14-39.11 44.61-56.42 91.47-62.1 109.46a47.507 47.507 0 0 0-2.22 14.3v.1h48v-.05c9.68-33.37 35.78-73.18 52.42-92.16C335.55 260.85 352 220.37 352 176 352 78.8 273.2 0 176 0z"></path>
        </svg>
        </a>
        <a data-toggle="tab" data-target="#music" href="javascript:;" className="py-2 flex justify-center flex-1 rounded hover:bg-gray-200 dark:hover:bg-dark-2" id="music-tab" role="tab" aria-controls="music" aria-selected="false">
        <svg className="w-4 h-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path fill="currentColor" d="M511.99 32.01c0-21.71-21.1-37.01-41.6-30.51L150.4 96c-13.3 4.2-22.4 16.5-22.4 30.5v261.42c-10.05-2.38-20.72-3.92-32-3.92-53.02 0-96 28.65-96 64s42.98 64 96 64 96-28.65 96-64V214.31l256-75.02v184.63c-10.05-2.38-20.72-3.92-32-3.92-53.02 0-96 28.65-96 64s42.98 64 96 64 96-28.65 96-64l-.01-351.99z"></path>
        </svg>
        </a>
        </div>
        <div className="tab-content overflow-hidden mt-5">
        <div className="h-full tab-pane active" id="history" role="tabpanel" aria-labelledby="history-tab">
        <div className="font-medium px-3">Recent Emojis</div>
        <div className="h-full pb-10 px-2 overflow-y-auto scrollbar-hidden mt-2">
        <div className="grid grid-cols-8 text-2xl">
        <button className="rounded hover:bg-gray-200 dark:hover:bg-dark-2 focus:outline-none">😀</button>
        <button className="rounded hover:bg-gray-200 dark:hover:bg-dark-2 focus:outline-none">😁</button>
        <button className="rounded hover:bg-gray-200 dark:hover:bg-dark-2 focus:outline-none">😂</button>
        </div>
        </div>
        </div>
        <div className="h-full tab-pane" id="smile" role="tabpanel" aria-labelledby="smile-tab">
        <div className="font-medium px-3">Smileys &amp; People</div>
        <div className="h-full pb-10 px-2 overflow-y-auto scrollbar-hidden mt-2">
        <div className="grid grid-cols-8 text-2xl">
        <button className="rounded hover:bg-gray-200 dark:hover:bg-dark-2 focus:outline-none">😀</button>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
        <a href="javascript:;" className="bg-theme-1 text-white w-8 h-8 sm:w-10 sm:h-10 block rounded-full flex-none flex items-center justify-center"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-send w-4 h-4 sm:w-5 sm:h-5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg> </a>
        </div>
      </div>
    </>
  );
}
