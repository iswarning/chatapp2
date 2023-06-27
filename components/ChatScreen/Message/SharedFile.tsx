import FileElement from '@/components/FileElement'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {useSelector} from 'react-redux'
import { selectAppState } from '@/redux/appSlice'
import { storage } from '@/firebase'
import { FileInMessageType } from '@/types/FileInMessageType'
import { ImageInMessageType } from '@/types/ImageInMessageType'
import { MessageType } from '@/types/MessageType'
import mime from 'mime-types'
import {v4 as uuidv4} from 'uuid'

function SharedFile({ messages, chatRoomId }: { messages: MessageType[], chatRoomId: string }) {

    const [active, setActive] = useState("Image")

    const [images, setImages] = useState<any[]>([])
    const [files, setFiles] = useState<any[]>([])
    const [videos, setVideos] = useState<any[]>([])
    const [medias, setMedias] = useState<any[]>([])

    useEffect(() => {
        getAllFile()
    },[])

    function getAllFile() {
        let pathFile = `public/chat-room/${chatRoomId}/files`;
        let pathPhoto = `public/chat-room/${chatRoomId}/photos`
        storage.ref(pathFile).listAll().then((results) => {
            results.items.forEach((result) => {
                result.getMetadata().then((meta) => {
                    let fileExtension = mime.extension(meta.contentType);
                    let data = {
                        size: meta.size / 1024 / 1024,
                        key:  uuidv4(),
                        name: meta.name, 
                        type: fileExtension,
                        path: result.fullPath
                    };
                    switch(fileExtension) {

                        case 'jpeg':
                            setImages((old) => [ ...old, data ])
                            break;

                        case 'png':
                            setImages((old) => [ ...old, data ])
                            break;
                            
                        case 'mp4':
                            setVideos((old) => [ ...old, data ])
                            break;
                              
                        case 'mp3':
                            setMedias((old) => [ ...old, data ])
                            break; 

                        default:
                            setFiles((old) => [ ...old, data ])
                            break; 
                        
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
                        type: fileExtension,
                        path: result.fullPath
                    };
                    setImages((old) => [...old, data ])
                })
            })
        })
    }

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
                    active === "Image" && images.length > 0 ? images.map((image) => <FileElement key={image.key} file={image} chatRoomId={chatRoomId} />) : null
                }
                {
                    active === "File" && files.length > 0 ? files.map((file) => <FileElement key={file.key} file={file} chatRoomId={chatRoomId} />) : null
                }
                {
                    active === "Video" && videos.length > 0 ? videos.map((file) => <FileElement key={file.key} file={file} chatRoomId={chatRoomId} />) : null
                }
                {
                    active === "Media" && medias.length > 0 ? medias.map((file) => <FileElement key={file.key} file={file} chatRoomId={chatRoomId} />) : null
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
