import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { ChangeEvent, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../../firebase";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux'
import { selectAppState, setAppGlobalState } from "@/redux/appSlice";
import { v4 as uuidv4, v5 } from 'uuid'
import sendNotificationFCM from "@/utils/sendNotificationFCM";
import { addMessageToFirebase } from "./Functions";
import { MessageType } from "@/types/MessageType";
import { getImageTypeFileValid } from "@/utils/getImageTypeFileValid";
import firebase from "firebase";
import { selectChatState } from "@/redux/chatSlice";
import { addNewMessage, setCurrentMessages } from "@/services/cache";
import { selectMessageState } from "@/redux/messageSlice";
import { AlertError } from "@/utils/core";
export default function DropdownAttach({ chatId, scrollToBottom, recipient, setProgress }: { chatId: string, scrollToBottom: any, recipient: any, setProgress: any }) {

  const [showDropdownAttach, setShowDropdownAttach] = useState(false);
  const [user] = useAuthState(auth);
  const dispatch = useDispatch()
  const chatState = useSelector(selectChatState)
  const messageState = useSelector(selectMessageState)

  async function onImageChange(event: any) {
    event.preventDefault();
    let newArray: any[] = []
    if (event.target.files && event.target.files.length > 0) {
      for (const file of event.target.files) {
        let img: File = file;
        let imgType = img["type"];
        let validImageTypes = ["image/jpeg", "image/png"];
        let fileSize = img.size / 1024 / 1024;

        if (!validImageTypes.includes(imgType)) {
          AlertError("Image upload invalid !")
          return;
        }

        if (fileSize > 5) {
          AlertError("Size image no larger than 5 MB !")
          return;
        }

        if (event.target.files.length >= 5) {
          AlertError("Maximum image attach !")
          return;
        }      
        
        let key = uuidv4(); 
        let path = `public/chat-room/${chatState.currentChat.id}/photos/${key}`
        storage
        .ref(path)
        .put(img)
        .on(
          "state_changed",
          () => {},
          (err) => console.log(err),
          () => {
            storage.ref(path).getDownloadURL().then((url) => {
              newArray.push({
                key: key,
                downloadUrl: url
              })
            })
          }
        );
      }
    }    

    if (newArray.length > 0) {
      let newMessage = {} as MessageType
      newMessage.id = uuidv4()
      newMessage.timestamp = firebase.firestore.FieldValue.serverTimestamp()
      newMessage.user = user?.email!
      newMessage.type = "image"
      newMessage.images = JSON.stringify(newArray)
      addNewMessage(newMessage, dispatch)
      db
      .collection("chats")
      .doc(chatId)
      .collection("messages")
      .add({...newMessage, images: JSON.stringify(JSON.parse(newMessage.images).map((img: any) => img.key))});
      scrollToBottom();
    }
  }

  const handleAttachFile = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    let result = []
    if(!event.target.files) return
    for(let i = 0; i < event.target.files.length ; i++) {
      let file: File = event.target.files[i]
      if (file) {
        let key = uuidv4()
        let fileType = file.name.split(".").pop();
        let validImageTypes = getImageTypeFileValid();
        let fileSize = file.size / 1024 / 1024;
        if (!validImageTypes.includes(fileType ?? "")) {
          AlertError("File upload invalid !")
          return;
        }
        if (fileSize > 100) {
          AlertError("Size file no larger than 100 MB !")
          return;
        }
        if (event.target.files.length >= 5) {
          AlertError("Maximum file upload !")
          return;
        }
        let newMessage = {} as MessageType
        newMessage.id = uuidv4()
        newMessage.file = JSON.stringify({
          key: key,
          name: file.name,
          size: fileSize
        })
        newMessage.type = "file-uploading"
        newMessage.user = user?.email!
        newMessage.timestamp = firebase.firestore.FieldValue.serverTimestamp()
        result.push({
          key: key,
          file: file
        })
        addNewMessage(newMessage, dispatch)
      }
    }
    if(result.length > 0)
      uploadFileQueuing(result)
  }

  let count = 0

  const uploadFileQueuing = (result: any) => {
    let path = `public/chat-room/${chatId}/files/${result[count].key}`
    storage
      .ref(path)
      .put(result[count].file)
      .on(
        "state_changed",
        (snapshot) => {
          let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          dispatch(setAppGlobalState({
            type: "setProgress",
            data: progress
          }))
          if (progress === 100) {
            dispatch(setAppGlobalState({
              type: "setFileUploading",
              data: {
                key: result[count].key,
                value: "done"
              }
            }))
            dispatch(setAppGlobalState({
              type: "setFileUploadDone",
              data: result[count].key
            }))
            if (count === result.length - 1) {
              return
            }
            count++
            uploadFileQueuing(result)
          } else if(progress > 1 && progress < 100) {
            dispatch(setAppGlobalState({
              type: "setFileUploading",
              data: {
                key: result[count].key,
                value: "uploading"
              }
            }
            ))
          }
        },
        (err) => {throw new Error(err.message)},
        () => {
          let getMsg = messageState.currentMessages
          .filter((msg) => msg.type === "file-uploading")
          .find((msg) => JSON.parse(msg.file!).key === result[count].key)
          db
          .collection("chats")
          .doc(chatId)
          .collection("messages")
          .add({...getMsg, type: "file"})
        }
      );
      
    // NotifyMessage()
  }

  

    const NotifyMessage = () => {
      let bodyNotify = "";

      if (chatState.currentChat.isGroup) {
        bodyNotify = chatState.currentChat.name + " sent a file "
      } else {
        bodyNotify = recipient.data().fullName + " sent a file "
      }

      sendNotificationFCM("New message !", bodyNotify, recipient?.data()?.fcm_token).catch(
        (err) => console.log(err)
      );
    }

    return (
      <div className="dropdown relative" data-placement="top">
        <a href="javascript:void(0)" className="text-gray-600 hover:text-theme-1 dropdown-toggle" onClick={() => setShowDropdownAttach(!showDropdownAttach)}> 
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus w-5 h-5 sm:w-6 sm:h-6">
            <line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>
          </svg> 
        </a>
        {
          showDropdownAttach ? <div className="chat-input__dropdown">
            <div className="dropdown-menu__content ">
              <a onClick={() => document.getElementById("upload-image")?.click()} href="javascript:void(0)" className="shadow-md text-gray-600 bg-white rounded-full dark:text-gray-300 dark:bg-dark-3 hover:bg-theme-1 hover:text-white dark:hover:bg-theme-1 flex items-center block p-3 transition duration-300 rounded-md mb-2"> 
                <input
                  type="file"
                  hidden
                  id="upload-image"
                  onChange={onImageChange}
                  multiple
                />
                <InsertPhotoIcon
                  fontSize="small"
                />
              </a>
              <a onClick={() => document.getElementById("upload-file")?.click()} href="javascript:void(0)" className="shadow-md text-gray-600 bg-white rounded-full dark:text-gray-300 dark:bg-dark-3 hover:bg-theme-1 hover:text-white dark:hover:bg-theme-1 flex items-center block p-3 transition duration-300 rounded-md mb-2"> 
                <input
                  type="file"
                  hidden
                  id="upload-file"
                  onChange={(e) => handleAttachFile(e)}
                  multiple
                />
                <AttachFileIcon
                  fontSize="small"
                />
              </a>
            </div>
          </div> : null
        }
      </div>
    )
}