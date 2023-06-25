import FileElement from '@/components/FileElement'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {useSelector} from 'react-redux'
import { selectAppState } from '@/redux/appSlice'
import { storage } from '@/firebase'
import { FileInMessageType } from '@/types/FileInMessageType'
import { ImageInMessageType } from '@/types/ImageInMessageType'
import { MessageType } from '@/types/MessageType'

function SharedFile({ messages }: { messages: MessageType[] }) {

    const [active, setActive] = useState("Image")

    const [images, setImages] = useState<any[]>([])
    const [files, setFiles] = useState<any[]>([])
    const [videos, setVideos] = useState<any[]>([])
    const [medias, setMedias] = useState<any[]>([])

    useEffect(() => {
        getAllFile()
    },[])

    function getAllFile() {
        messages?.forEach((message) => {
            switch(message.type){
                case 'text-image':
                    if (message.imageInMessage?.length! > 0) {
                        message.imageInMessage?.forEach((img) => {
                            setImages((old: any) => [...old!, img])
                        })
                    }
                    break;
                case 'image':
                    if (message.imageAttach?.length! > 0) {
                        message.imageAttach?.forEach((img) => {
                            setImages((old: any) => [...old!, img])
                        })
                    }
                    break;
                case 'file':
                    if (Object.keys(message?.fileAttach!).length > 0) {
                        switch(message?.fileAttach?.type){
                            case 'mp4':
                                setVideos((old : any) => [ ...old, message?.fileAttach ])
                                break;
                            case 'mp3':
                                setMedias((old: any) => [ ...old, message?.fileAttach ])
                                break;
                            case 'jpg':
                                setImages((old: any) => [ ...old, message.fileAttach ])
                                break;
                            case 'png':
                                setImages((old: any) => [ ...old, message?.fileAttach ])
                                break;
                            default:
                                setFiles((old: any) => [ ...old, message?.fileAttach ])
                                break;
                        }
                    }
                    break;
            }
        })
    }
    // const imageInMessage = appState.currentMessages.filter((message) => message.imageInMessage?.length! > 0).map((message) => message.imageInMessage)

  return (
    <>
        <div className="mt-4 overflow-x-hidden overflow-y-auto scrollbar-hidden">
                <div className="flex mb-4">
                    {
                        active === "Image" ? <BtnActive>Image</BtnActive> : <BtnCutom onClick={() => setActive("Image")}>Image</BtnCutom>
                    }
                    {
                        active === "File" ? <BtnActive>File</BtnActive> : <BtnCutom onClick={() => setActive("File")}>File</BtnCutom>
                    }
                    {
                        active === "Video" ? <BtnActive>Video</BtnActive> : <BtnCutom onClick={() => setActive("Video")}>Video</BtnCutom>
                    }
                    {
                        active === "Media" ? <BtnActive>Media</BtnActive> : <BtnCutom onClick={() => setActive("Media")}>Media</BtnCutom>
                    }
                </div>
                {
                    active === "Image" && images.length > 0 ? images.map((image) => <FileElement key={image.key} file={image} />) : null
                }
                {
                    active === "File" && files.length > 0 ? files.map((file) => <FileElement key={file.key} file={file} />) : null
                }
                {
                    active === "Video" && videos.length > 0 ? videos.map((file) => <FileElement key={file.key} file={file} />) : null
                }
                {
                    active === "Media" && medias.length > 0 ? medias.map((file) => <FileElement key={file.key} file={file} />) : null
                }
        </div>
    </>
  )
}

export default React.memo(SharedFile)

const BtnCutom = styled.button`
    margin-right: 20px;
    &:focus {
        border: none;
        outline: none;
    }
`

const BtnActive = styled(BtnCutom)`
    border-bottom: 2px solid blue;
`
