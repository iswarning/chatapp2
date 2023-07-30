
import React, { useState } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { selectChatState } from '@/redux/chatSlice'
import Image from 'next/image'
import { FileInfo } from '@/types/ChatType'
import DownloadIcon from '@mui/icons-material/Download';
import CancelIcon from '@mui/icons-material/Cancel';
import { ActionContainer, ActionElement, BtnMore } from '@/components/MemberInChat'
import { selectAppState } from '@/redux/appSlice'

function SharedFile() {

    const [active, setActive] = useState("Photos")

    const chatState = useSelector(selectChatState)

    const photos = chatState.listChat[chatState.currentChat.index].listImage

    const files = chatState.listChat[chatState.currentChat.index].listFile?.filter((file) => file.extension !== "mp4")

    const videos = chatState.listChat[chatState.currentChat.index].listFile?.filter((file) => file.extension === "mp4")


  return (
    <>
        <div className="mt-4 overflow-x-hidden overflow-y-auto scrollbar-hidden" style={{maxHeight: '450px'}}>
                <div className='flex'>
                    {
                        active === "Photos" ? <BtnActive>Photos</BtnActive> : <BtnCustom onClick={() => setActive("Photos")}>Photos</BtnCustom>
                    }
                    {
                        active === "Files" ? <BtnActive>Files</BtnActive> : <BtnCustom onClick={() => setActive("Files")}>Files</BtnCustom>
                    }
                    {
                        active === "Links" ? <BtnActive>Links</BtnActive> : <BtnCustom onClick={() => setActive("Links")}>Links</BtnCustom>
                    }
                    {
                        active === "Videos" ? <BtnActive>Videos</BtnActive> : <BtnCustom onClick={() => setActive("Videos")}>Videos</BtnCustom>
                    }
                </div>
                {
                    active === "Photos" && photos?.length! > 0 ? photos?.map((file) => <PhotoElement key={file.key} file={file} />) : null
                }
                {
                    active === "Files" && files?.length! > 0 ? files?.map((file) => <FileElement key={file.key} file={file} />) : null
                }
        </div>
    </>
  )
}

export default SharedFile

const BtnCustom = styled.div`
    cursor: pointer;
    margin-right: 10px;
`
const BtnActive = styled(BtnCustom)`
    border-bottom: 2px solid #01C8CA;
`

function PhotoElement({ file }: { file: FileInfo }) {

    const [showAction, setShowAction] = useState(false)
    const fileName = file.name.length > 20 ? file.name.slice(0, 20) + "..." + file.extension : file.name + "." + file.extension
    const chatState = useSelector(selectChatState)
    const appState = useSelector(selectAppState)
    
  return (
    <div className="shared-file border-gray-200 dark:border-dark-5 flex items-center p-3 border rounded-md mt-3">
        {
            file ? <Image src={file.url} width={50} height={50} alt='' className='rounded-md' style={{height: '50px', width: '50px'}} /> : null
        }
        <div className="w-full ml-3">
            <div className="text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium truncate">{fileName}</div>
            <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">{Number((file?.size! / 1024 / 1024).toFixed(1))} MB</div>
        </div>
        <div>
            <BtnMore onClick={() => setShowAction(!showAction)}> 
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical w-4 h-4">
              <circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> 
            </BtnMore>
            {
              showAction ? <ActionContainer className='box'>
                <ActionElement><DownloadIcon fontSize='small' /> Download</ActionElement>
                {
                  chatState.listChat[chatState.currentChat.index].admin === appState.userInfo._id ? 
                    <ActionElement><CancelIcon fontSize='small' /> Remove file</ActionElement> 
                  : null
                }
              </ActionContainer>: null
            }
        </div>
    </div>
  )
}

function FileElement({ file }: { file: FileInfo }) {
    const [showAction, setShowAction] = useState(false)
    const chatState = useSelector(selectChatState)
    const appState = useSelector(selectAppState)
    const fileName = file.name.length > 20 ? file.name.slice(0, 20) + "..." + file.extension : file.name + "." + file.extension

  return (
    <div className="shared-file border-gray-200 dark:border-dark-5 flex items-center p-3 border rounded-md mt-3">
        <div className="shared-file__icon text-white w-12 flex-none bg-contain relative bg-no-repeat bg-center block">
            <div className="absolute m-auto top-0 left-0 right-0 bottom-0 flex items-center justify-center">{file.extension.toUpperCase()}</div>
        </div>
        <div className="w-full ml-3">
            <div className="text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium truncate">{fileName}</div>
            <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">{Number((file?.size! / 1024 / 1024).toFixed(1))} MB</div>
        </div>
        <div>
            <BtnMore onClick={() => setShowAction(!showAction)}> 
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical w-4 h-4">
              <circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> 
            </BtnMore>
            {
              showAction ? <ActionContainer className='box'>
                <ActionElement><DownloadIcon fontSize='small' /> Download</ActionElement>
                {
                  chatState.listChat[chatState.currentChat.index].admin === appState.userInfo._id ? 
                    <ActionElement><CancelIcon fontSize='small' /> Remove file</ActionElement> 
                  : null
                }
              </ActionContainer>: null
            }
        </div>
    </div>
  )
}