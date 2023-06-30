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
import PermMediaIcon from '@mui/icons-material/PermMedia';
import LinkIcon from '@mui/icons-material/Link';
import DescriptionIcon from '@mui/icons-material/Description';

function SharedFile({ messages, chatRoomId }: { messages: MessageType[], chatRoomId: string }) {

    const [active, setActive] = useState("Image")

    const [mediaFile, setMediaFile] = useState<any[]>([])
    const [files, setFiles] = useState<any[]>([])

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
                    if (fileExtension === "jpeg" 
                    || fileExtension === "jpg" 
                    || fileExtension === "png" 
                    || fileExtension === "mp4") {
                        setMediaFile((old) => [...old, data ])
                    } else {
                        setFiles((old) => [...old, data ])
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
                    // setImages((old) => [...old, data ])
                })
            })
        })
    }

  return (
    <>
        <div className="mt-4 overflow-x-hidden overflow-y-auto scrollbar-hidden">
                <div>
                    <LinkElement>
                        <PermMediaIcon fontSize='medium' className='mr-2' /> Media File
                    </LinkElement>
                    <LinkElement>
                        <DescriptionIcon fontSize='medium' className='mr-2' /> Other File
                    </LinkElement>
                    <LinkElement>
                        <LinkIcon fontSize='medium' className='mr-2 hover:bg-sky-700' /> Link
                    </LinkElement>
                    {/* {
                        active === "Media Files" ? <BtnActive>Image</BtnActive> : <BtnCutom onClick={() => setActive("Image")}>Image</BtnCutom>
                    }
                    {
                        active === "Other Files" ? <BtnActive>File</BtnActive> : <BtnCutom onClick={() => setActive("File")}>File</BtnCutom>
                    }
                    {
                        active === "Links" ? <BtnActive>File</BtnActive> : <BtnCutom onClick={() => setActive("File")}>File</BtnCutom>
                    } */}
                </div>
                {/* {
                    active === "Image" && images.length > 0 ? images.map((image) => <FileElement key={image.key} file={image} chatRoomId={chatRoomId} />) : null
                }
                {
                    active === "File" && files.length > 0 ? files.map((file) => <FileElement key={file.key} file={file} chatRoomId={chatRoomId} />) : null
                } */}
        </div>
    </>
  )
}

export default SharedFile

const LinkElement = styled.div`
    margin-bottom: 10px;
    margin-left: 5px;
    height: 100%;
    cursor: pointer;
    :hover {
        background-color: whitesmoke;
        border-radius: 10px;
    }
    padding: 10px;
`
