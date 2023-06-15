import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useState } from "react";
import { addMessageToFirebase, handleImageInMessage, onAttachFile, pushUrlImageToFirestore } from "./ChatPage/Functions";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, storage } from "../firebase";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux'
import { selectAppState, setChatData } from "@/redux/appSlice";
import { MapMessageData } from "@/types/MessageType";

export default function DropdownAttach({ chatId, scrollToBottom }: { chatId: string, scrollToBottom: any }) {

  const [showDropdownAttach, setShowDropdownAttach] = useState(false);
  const [user] = useAuthState(auth);
  const dispatch = useDispatch()
  const appState = useSelector(selectAppState)

  async function onImageChange(event: any) {
    let urls = [];
    let count = 0;
    if (event.target.files && event.target.files.length > 0) {
      for (const file of event.target.files) {
        let img = file;
        let imgType = img["type"];
        let validImageTypes = ["image/jpeg", "image/png"];
        let fileSize = img.size / 1024 / 1024;
        if (!validImageTypes.includes(imgType)) {
          toast("Image upload invalid !", {
            hideProgressBar: true,
            type: "error",
            autoClose: 5000,
          });
          return;
        }
        if (fileSize > 5) {
          toast("Size image no larger than 5 MB !", {
            hideProgressBar: true,
            type: "error",
            autoClose: 5000,
          });
          return;
        }

        storage.ref(`public/images/message/${}/#img-attach-msg/${}`)

        dispatch(setChatData({
          ...appState.chatData,
          messages: [...appState.chatData.messages!, MapMessageData(snap)]
        }))
      }

      const  { messageDoc } = await addMessageToFirebase( "#img-attach-msg" ,"image", user?.email, chatId);

    }
  }

    return (
      <div className="dropdown relative" data-placement="top">
        <a href="javascript:void(0)" className="text-gray-600 hover:text-theme-1 dropdown-toggle" onClick={() => setShowDropdownAttach(!showDropdownAttach)}> 
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-plus w-5 h-5 sm:w-6 sm:h-6">
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
                  onClick={() =>
                    document.getElementById("upload-image")?.click()
                  }
                />
              </a>
              <a onClick={() => document.getElementById("upload-file")?.click()} href="javascript:void(0)" className="shadow-md text-gray-600 bg-white rounded-full dark:text-gray-300 dark:bg-dark-3 hover:bg-theme-1 hover:text-white dark:hover:bg-theme-1 flex items-center block p-3 transition duration-300 rounded-md mb-2"> 
                <input
                  type="file"
                  hidden
                  id="upload-file"
                  onChange={(event) => onAttachFile(event, user?.email, chatId, scrollToBottom)}
                />
                <AttachFileIcon
                  fontSize="small"
                  onClick={() =>
                    document.getElementById("upload-file")?.click()
                  }
                />
              </a>
            </div>
          </div> : null
        }
      </div>
    )
}