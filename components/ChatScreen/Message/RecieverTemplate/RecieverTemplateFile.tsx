import { storage } from '@/firebase';
import { selectAppState } from '@/redux/appSlice';
import { selectChatState } from '@/redux/chatSlice';
import { MessageType } from '@/types/MessageType';
import React from 'react'
import { useDownloadURL } from 'react-firebase-hooks/storage';
import {useSelector} from 'react-redux'

export default function RecieverTemplateFile({ file, lastIndex, timestamp }: { file: MessageType, lastIndex: boolean, timestamp: any }) {

    const chatState = useSelector(selectChatState)
    
    const storageRef = storage.ref(`public/chat-room/${chatState.currentChat._id}/files/${file?.key}`)

    const [downloadUrl] = useDownloadURL(storageRef)

    const handleDownloadFile = async() => {
        const response = await fetch(downloadUrl!);
        const blob = await response.blob();
        downloadBlob(blob, file?.name!)
    }

    function downloadBlob(blob: Blob, name: string) {
        // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
        const blobUrl = URL.createObjectURL(blob);
      
        // Create a link element
        const link = document.createElement("a");
      
        // Set link's href to point to the Blob URL
        link.href = blobUrl;
        link.download = name;
      
        // Append link to the body
        document.body.appendChild(link);
      
        // Dispatch click event on the link
        // This is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(
          new MouseEvent('click', { 
            bubbles: true, 
            cancelable: true, 
            view: window 
          })
        );
      
        // Remove link from body
        document.body.removeChild(link);
    }

    const fileName = file?.name!.split(".")[0]
    const fileExtension = file?.name!.split(".").pop()
  
    return (
    <>
    {
        <div className="-intro-x chat-text-box flex items-end float-left mb-4" title={timestamp}>
            {
                chatState.currentChat.isGroup && lastIndex ? <div className="chat-text-box__photo w-10 h-10 hidden sm:block flex-none image-fit relative mr-4">
                    <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-full" src="https://topson.left4code.com/dist/images/profile-9.jpg"/>
                </div> : null
            }
            <div className="w-full">
                <div>
                    <div className="chat-text-box__content flex items-center float-left">
                        <div className="box leading-relaxed text-gray-700 dark:text-gray-300 flex flex-col sm:flex-row items-center mt-3 p-3">
                            <div className="chat-text-box__content__icon text-white w-12 flex-none bg-contain relative bg-no-repeat bg-center block">
                                <div className="absolute m-auto top-0 left-0 right-0 bottom-0 flex items-center justify-center">{fileExtension?.toUpperCase()}</div>
                            </div>
                            <div className="sm:ml-3 mt-3 sm:mt-0 text-center sm:text-left">
                                <div className="text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium truncate">{fileName?.length! >= 20 ? fileName?.substring(0, 20) + "..." + fileExtension : fileName + "." + fileExtension}</div>
                                <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">Size: { file?.size! } MB</div>
                            </div>
                            <div className="sm:ml-20 mt-3 sm:mt-0 flex">
                                <a href='javascript:void(0)' onClick={() => handleDownloadFile()} className="tooltip w-8 h-8 block border rounded-full flex-none flex items-center justify-center ml-2 outline-none"> 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download w-4 h-4">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg> 
                                </a>
                                <a href="javascript:void(0)" className="tooltip w-8 h-8 block border rounded-full flex-none flex items-center justify-center ml-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share w-4 h-4"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg> </a>
                                <a href="javascript:void(0)" className="tooltip w-8 h-8 block border rounded-full flex-none flex items-center justify-center ml-2"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg> </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
    <div className="clear-both"></div>
    </>
  )
}
