import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../../firebase";
import { useDispatch, useSelector } from 'react-redux'
import { StatusSendType, selectAppState } from "@/redux/appSlice";
import { v4 as uuidv4 } from 'uuid'
import sendNotificationFCM from "@/utils/sendNotificationFCM";
import { getImageTypeFileValid } from "@/utils/getImageTypeFileValid";
import firebase from "firebase";
import { selectChatState } from "@/redux/chatSlice";
import { addPrepareSendFiles, pushMessageToListChat, setFileUploadDone, setFileUploading, setProgress, setStatusSend } from "@/services/CacheService";
import { AlertError } from "@/utils/core";
import { MessageType } from "@/types/MessageType";

export default function DropdownAttach({ chatId, scrollToBottom, recipient }: { chatId: string, scrollToBottom: any, recipient: any }) {

  const [showDropdownAttach, setShowDropdownAttach] = useState(false);
  const [user] = useAuthState(auth);
  const dispatch = useDispatch()
  const chatState = useSelector(selectChatState)
  const appState = useSelector(selectAppState)

  function onImageChange(event: any) {
    event.preventDefault();
    if (event.target.files && event.target.files.length > 0) {
      for (const file of event.target.files) {
        let imgType = file["type"];
        let validImageTypes = ["image/jpeg", "image/png"];
        let fileSize = file.size / 1024 / 1024;

        if (!validImageTypes.includes(imgType)) {
          AlertError("Image upload invalid !")
          return;
        }

        if (fileSize > 5) {
          AlertError("Size image no larger than 5 MB !")
          return;
        }

        if (appState.prepareSendFiles.length >= 10) {
          AlertError("Maximum files is 10 !")
          return;
        }   

        if(appState.prepareSendFiles.length > 0 && appState.prepareSendFiles.find((file) => file.size === fileSize)) return
        addPrepareSendFiles(file,dispatch)

      }
    }   
  }

  const handleAttachFile = (event: any) => {
    setStatusSend(StatusSendType.SENDING, dispatch)
    event.preventDefault()
    let result = []
    if(!event.target.files) return
    for(const element of event.target.files) {
      let file: File = element
      if (file) {
        let key = uuidv4()
        let fileSize = file.size / 1024 / 1024;
        if (!getImageTypeFileValid().includes(file.name.split(".").pop() ?? "")) {
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
        newMessage._id = uuidv4()
        newMessage.file = JSON.stringify({
          key: key,
          name: file.name,
          size: fileSize
        })
        newMessage.type = "file-uploading"
        newMessage.senderId = appState.userInfo._id!
        newMessage.createdAt = new Date().toLocaleString()
        result.push({
          key: key,
          file: file
        })
        pushMessageToListChat(chatId, newMessage, dispatch)
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
          setProgress(progress, dispatch)
          if (progress === 100) {
            setFileUploading(result[count].key, "done", dispatch)
            setFileUploadDone(result[count].key, dispatch)
            if (count === result.length - 1) {
              return
            }
            count++
            uploadFileQueuing(result)
          } else if(progress > 1 && progress < 100) {
            setFileUploading(result[count].key, "uploading", dispatch)
          }
        },
        (err) => {throw new Error(err.message)},
        () => {
          db
          .collection("chats")
          .doc(chatId)
          .collection("messages")
          .add({
            type: "file",
            user: user?.email,
            file: result[count].key,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
          })
          .then(() => {
            setStatusSend(StatusSendType.SENT, dispatch)
          })
          .catch(err => {
            console.log(err);
            setStatusSend(StatusSendType.ERROR, dispatch)
            AlertError("Error when send message !")
          })
        }
      );
      
    NotifyMessage()
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
                  onChange={(e) => onImageChange(e)}
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