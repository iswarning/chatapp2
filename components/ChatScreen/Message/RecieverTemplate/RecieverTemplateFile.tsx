import { storage } from '@/firebase';
import { selectAppState } from '@/redux/appSlice';
import { selectChatState } from '@/redux/chatSlice';
import { ChatType } from '@/types/ChatType';
import { MessageType } from '@/types/MessageType';
import React from 'react'
import { useDownloadURL } from 'react-firebase-hooks/storage';
import {useSelector} from 'react-redux'
import styled from 'styled-components';
import Image from 'next/image';

export default function RecieverTemplateFile({ 
    showAvatar, 
    chat, 
    message, 
    lastIndex, 
    timestamp, 
    handleReaction 
}: { 
    showAvatar: boolean, 
    chat: ChatType, 
    message: MessageType, 
    lastIndex: boolean,
    timestamp: any,
    handleReaction: any }) {

    const chatState = useSelector(selectChatState)

    const storageRef = storage.ref(`public/chat-room/${chatState.currentChat}/files/${message.file}`)
    
    const file = chatState.listChat.find((chat) => chatState.currentChat === chat._id)?.listFile?.find((image) => image.key === message.file)

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
                chat.isGroup && showAvatar ? <div className="chat-text-box__photo w-10 h-10 hidden sm:block flex-none image-fit relative mr-4">
                    <Image
                    src={chat.listRecipientInfo?.find((info) => info._id === message.senderId)?.photoURL!}
                    width={64}
                    height={64}
                    alt=""
                    className="rounded-full mt-6"
                    />
                </div> : <div className="chat-text-box__photo w-10 h-10 hidden sm:block flex-none image-fit relative mr-4"></div>
            }
            <div className="w-full">
                <div>
                    <div className="chat-text-box__content flex items-center float-left">
                        <div className="box leading-relaxed text-gray-700 dark:text-gray-300 flex flex-col sm:flex-row items-center mt-3 p-3">
                            <div className="chat-text-box__content__icon text-white w-12 flex-none bg-contain relative bg-no-repeat bg-center block">
                                <div className="absolute m-auto top-0 left-0 right-0 bottom-0 flex items-center justify-center">{file?.extension?.toUpperCase()}</div>
                            </div>
                            <div className="sm:ml-3 mt-3 sm:mt-0 text-center sm:text-left">
                                <div className="text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium truncate">
                                { file?.name?.length! >= 20 ? 
                                        file?.name?.substring(0, 20) + "..." + file?.extension
                                        : file?.name + "." + file?.extension}
                                </div>
                                <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">Size: { (file?.size! / 1024 / 1024).toFixed(1) } MB</div>
                            </div>
                            <div className="sm:ml-20 mt-3 sm:mt-0 flex">
                                <BtnDownload onClick={() => handleDownloadFile()}> 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download w-4 h-4">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg> 
                                </BtnDownload>
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

const BtnDownload = styled.button.attrs(() => ({
    className: "tooltip w-8 h-8 block border rounded-full flex-none flex items-center justify-center ml-2 outline-none"
}))`
    &:focus {
        outline: none;
    }
`
