import FileElement from '@/components/FileElement'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {useSelector} from 'react-redux'
import { selectAppState } from '@/redux/appSlice'
import { storage } from '@/firebase'

export default function SharedFile() {

    const [active, setActive] = useState("Image")
    const appState = useSelector(selectAppState)
    const [images, setImages] = useState<any>([])
    const [files, setFiles] = useState<any>([])
    const [videos, setVideos] = useState<any>([])
    const [medias, setMedias] = useState<any>([])
   
    useEffect(() => {
        const getListImage = async() => {

            let photoPath = `public/chat-room/${appState.currentChat.id}/photos`;

            (await storage.ref(photoPath).listAll()).items.forEach((photo) => {
                photo.getDownloadURL().then((url) => {
                    let key = photo.name.split(".")[0];
                    photo.getMetadata().then((meta) => {
                        setImages((old: any) => [ ...old, { key: key, name: photo.name, size: meta.size, url: url } ])
                    })
                })
            })
        }
        getListImage().catch(err => console.log(err));
    },[])

    useEffect(() => {
        const getListFile = async() => {

            let filePath = `public/chat-room/${appState.currentChat.id}/files`;

            (await storage.ref(filePath).listAll()).items.forEach((file) => {
                file.getMetadata().then((meta) => {
                    file.getDownloadURL().then((url: any) => {
                        let key = file.name.split(".")[0];
                        let type = file.name.split(".")[1];
                        if (type === 'mp4') {
                            setVideos((old: any) => [ ...old, { key: key, name: file.name, type: meta.contentType.split("/").pop(), url: url } ])
                        }
                        if (type === 'mp3') {
                            setMedias((old: any) => [ ...old, { key: key, name: file.name, type: meta.contentType.split("/").pop(), url: url } ])
                        }
                        if (type !== 'mp4' && type !== 'mp3') {
                            setFiles((old: any) => [ ...old, { key: key, name: file.name, type: meta.contentType.split("/").pop(), url: url } ])
                        }
                    })
                })
            })
        }
        getListFile().catch(err => console.log(err));
    },[])

    // useEffect(() => {
    //     getAllFile()
    // },[])

    // function getAllFile() {
    //     appState.currentMessages.forEach((message) => {
    //         switch(message.type){
    //             case 'text-image':
    //                 if (message.imageInMessage?.length! > 0) {
    //                     message.imageInMessage?.forEach((img) => {
    //                         setImages((old: any) => [...old!, img])
    //                     })
    //                 }
    //                 break;
    //             case 'image':
    //                 if (message.imageAttach?.length! > 0) {
    //                     message.imageAttach?.forEach((img) => {
    //                         setImages((old: any) => [...old!, img])
    //                     })
    //                 }
    //                 break;
    //             case 'file':
    //                 if (message.fileAttach?.length! > 0) {
    //                     message.fileAttach?.forEach((file) => {
    //                         switch(file.type){
    //                             case 'mp4':
    //                                 setVideos((old : any) => [...old, file])
    //                                 break;
    //                             case 'mp3':
    //                                 setMedias((old: any) => [...old, file])
    //                                 break;
    //                             default:
    //                                 setFiles((old: any) => [...old, file])
    //                                 break;
    //                         }
    //                     })
    //                 }
    //                 break;
    //         }
    //     })
    // }
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
                    active === "Image" && images.length > 0 ? images.map((image: any) => <FileElement key={image.key} file={image} />) : null
                }
                {
                    active === "File" && files.length > 0 ? files.map((file: any) => <FileElement key={file.key} file={file} />) : null
                }
                {
                    active === "Video" && videos.length > 0 ? videos.map((file: any) => <FileElement key={file.key} file={file} />) : null
                }
                {
                    active === "Media" && medias.length > 0 ? medias.map((file: any) => <FileElement key={file.key} file={file} />) : null
                }
        </div>
    </>
  )
}

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
