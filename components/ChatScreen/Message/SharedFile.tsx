import FileElement from '@/components/FileElement'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { storage } from '@/firebase'
import mime from 'mime-types'
import {v4 as uuidv4} from 'uuid'
import { useSelector } from 'react-redux'
import { selectAppState } from '@/redux/appSlice'
import { selectChatState } from '@/redux/chatSlice'

function SharedFile() {

    const [active, setActive] = useState("Media Files")

    const [mediaFile, setMediaFile] = useState<any[]>([])
    const [files, setFiles] = useState<any[]>([])
    const chatState = useSelector(selectChatState)

    useEffect(() => {
        getAllFile()
    },[])

    function getAllFile() {
        let pathFile = `public/chat-room/${chatState.currentChat.chatRoomId}/files`;
        let pathPhoto = `public/chat-room/${chatState.currentChat.chatRoomId}/photos`
        storage.ref(pathFile).listAll().then((results) => {
            results.items.forEach((result) => {
                result.getMetadata().then((meta) => {
                    let fileExtension = mime.extension(meta.contentType);
                    let data = {
                        size: meta.size / 1024 / 1024,
                        key:  uuidv4(),
                        name: meta.name, 
                        path: result.fullPath
                    };
                    switch(fileExtension) {
                        case "jpeg" || "jpg" || "png":
                            setMediaFile((old) => [...old, { ...data, type: "image", extension: fileExtension } ])
                        case "mp4":
                            setMediaFile((old) => [...old, { ...data, type: "video", extension: fileExtension } ])
                        default:
                            setFiles((old) => [...old, { ...data, type: "file", extension: fileExtension } ])
                    }
                })
            })
        })

        storage.ref(pathPhoto).listAll().then((results) => {
            results.items.forEach((result) => {
                result.getMetadata().then((meta) => {
                    let fileExtension = mime.extension(meta.contentType);
                    let data = {
                        size: meta.size / 1024 / 1024,
                        key:  uuidv4(),
                        name: meta.name,
                        path: result.fullPath
                    };
                    setMediaFile((old) => [...old, { ...data, type: "image", extension: fileExtension } ])
                })
            })
        })
    }

  return (
    <>
        <div className="mt-4 overflow-x-hidden overflow-y-auto scrollbar-hidden" style={{maxHeight: '450px'}}>
                <div className='flex'>
                    {
                        active === "Media Files" ? <BtnActive>Media Files</BtnActive> : <BtnCustom onClick={() => setActive("Media Files")}>Media Files</BtnCustom>
                    }
                    {
                        active === "Other Files" ? <BtnActive>Other Files</BtnActive> : <BtnCustom onClick={() => setActive("Other Files")}>Other Files</BtnCustom>
                    }
                    {
                        active === "Links" ? <BtnActive>Links</BtnActive> : <BtnCustom onClick={() => setActive("Links")}>Links</BtnCustom>
                    }
                </div>
                {
                    active === "Media Files" && mediaFile.length > 0 ? mediaFile.map((file) => <FileElement key={file.key} file={file} />) : null
                }
                {
                    active === "Other Files" && files.length > 0 ? files.map((file) => <FileElement key={file.key} file={file} />) : null
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