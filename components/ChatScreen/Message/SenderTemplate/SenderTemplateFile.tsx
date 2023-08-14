import { storage } from '@/firebase';
import { MessageType } from '@/types/MessageType';
import React from 'react'
import { useDownloadURL } from 'react-firebase-hooks/storage';
import { selectAppState } from '@/redux/appSlice';
import {useSelector} from 'react-redux'
import CancelIcon from '@mui/icons-material/Cancel';
import styled from 'styled-components';
import { selectChatState } from '@/redux/chatSlice';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import StatusSend from './StatusSend';
import downloadFile from '@/modules/downloadFile';

export default function SenderTemplateFile({ 
    message,
    lastIndex,
    timestamp,
    type,
    handleReaction
}: { 
    message: MessageType,
    lastIndex: boolean,
    timestamp: any,
    type: string,
    handleReaction: any
}) {
    const appState = useSelector(selectAppState)
    const chatState = useSelector(selectChatState)

    const data = chatState.listChat[chatState.currentChat.index].listFile?.find((image) => image.key === message.file)

    const storageRef = storage.ref(`public/chat-room/${chatState.currentChat.chatRoomId}/files/${message.file}`)
    const file = type === "file-uploading" ? JSON.parse(message.message!) : data
    const [downloadUrl] = useDownloadURL(storageRef)

    const handleDownloadFile = async() => {
        await downloadFile(downloadUrl!, file.name)
    }

    const progress = appState.UploadProgressMultipleFile
    const showFileProgress = () => {
        if (type === "file-uploading") {
            if (appState?.fileUploading?.value === "uploading" && appState?.fileUploading?.key === file?.key) {
                return <>
                    Size: { Number(progress * Number(file?.size) / 100).toFixed(1) + "/" + file?.size.toFixed(1) } MB
                    &nbsp;<CancelIcon fontSize='small' style={{fontSize: "15px"}} />
                    <ProgressBar style={{width: `${progress}%`}} />
                </>
            }
            if (appState.fileUploadDone.includes(file?.key)) {
                return <>
                    Size: { file?.size.toFixed(1) + "/" + file?.size.toFixed(1) } MB
                    &nbsp;<DoneIcon fontSize='small' style={{marginBottom: "3px"}} />
                </>
            }
        } else {
            return <>
                Size: { (file?.size! / 1024 / 1024).toFixed(1) } MB
            </>
        }
    }

    return (
    <>
    {
        file ? <div className="chat-text-box flex items-end float-right mb-4 pr-4" title={timestamp}>
            <div className="w-full">
                <div>
                    <div className="chat-text-box__content flex items-center float-right">
                        <div className="box leading-relaxed text-gray-700 dark:text-gray-300 flex flex-col sm:flex-row items-center mt-3 p-3">
                            <div className="chat-text-box__content__icon text-white w-12 flex-none bg-contain relative bg-no-repeat bg-center block">
                                <div className="absolute m-auto top-0 left-0 right-0 bottom-0 flex items-center justify-center">{file.extension?.toUpperCase()}</div>
                            </div>
                            <div className="sm:ml-3 mt-3 sm:mt-0 text-center sm:text-left">
                                <div className="text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium truncate" style={{maxWidth: "150px"}}>
                                    { file.name?.length! >= 20 ? 
                                        file.name?.substring(0, 20) + "..." + file.extension
                                        : file.name + "." + file.extension}
                                </div>
                                <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">
                                    {showFileProgress()}
                                </div>
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
            <StatusSend lastIndex={lastIndex} />
        </div> : null
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

const DoneIcon = styled(CheckCircleOutlineIcon)`
    font-size: 15px;
    color: rgb(193, 174, 252);
`

const ProgressBar = styled.div`
    background: #C1AEFC;
    height: 5px;
    border-radius: 5px; 
    margin-top: 5px
`

