import { setDownloadMultipleFile } from '@/services/CacheService'
import { Button, Modal } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {useSelector,useDispatch} from 'react-redux'
import { selectAppState } from '@/redux/appSlice'
import Image from 'next/image'
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';
import { selectChatState } from '@/redux/chatSlice'
import { FileInfo } from '@/types/ChatType'
import downloadFile from '@/modules/downloadFile'

export default function DownloadMultipleFile() {
    const appState = useSelector(selectAppState)
    const chatState = useSelector(selectChatState)
    const dispatch = useDispatch()
    const [listDownload, setListDownload] = useState<{ name: string, url: string }[]>([])

    const listImage = chatState.listChat[chatState.currentChat.index].listImage
    const listFile = chatState.listChat[chatState.currentChat.index].listFile

    const handleDownload = async() => {
        for(const data of listDownload) {
            await downloadFile(data.url, data.name)
        }
    }

  return (
    <>
        <Modal open={true} onClose={() => setDownloadMultipleFile(!appState.downloadMultipleFile.isShow, [], dispatch)}>
            <ModalContainer className='box'>
                <div className='flex ml-2'>
                    <h3>Download Multiple File</h3>
                    <span className='ml-auto cursor-pointer'>
                        <ClearIcon fontSize='small' onClick={() => setDownloadMultipleFile(!appState.downloadMultipleFile.isShow, [], dispatch)} />
                    </span>
                </div>
                <MainContainer>
                    <ScrollBarCustom>
                        {
                            listImage?.length! > 0 ? listImage?.map((file, i) =>  
                                i < listImage.length / 2 ? 
                                    <Element 
                                    key={file.key} 
                                    type="image" 
                                    file={file} 
                                    addToDownload={(data) => setListDownload((pre) => [...pre, data])}
                                    checked={appState.downloadMultipleFile.keys.includes(file.key)} /> : null ) : null
                        }
                    </ScrollBarCustom>
                    <ScrollBarCustom>
                        {
                            listImage?.length! > 0 ? listImage?.map((file, i) =>  
                                i >= listImage.length / 2 ? 
                                    <Element 
                                    key={file.key} 
                                    type="image" 
                                    file={file} 
                                    addToDownload={(data) => setListDownload((pre) => [...pre, data])}
                                    checked={appState.downloadMultipleFile.keys.includes(file.key)} /> : null ) : null
                        }
                    </ScrollBarCustom>
                    <ScrollBarCustom>
                        {
                            listFile?.length! > 0 ? listFile?.map((file, i) =>  
                                i < listFile.length / 2 ? 
                                    <Element 
                                    key={file.key} 
                                    type="file" 
                                    file={file} 
                                    addToDownload={(data) => setListDownload((pre) => [...pre, data])}
                                    checked={appState.downloadMultipleFile.keys.includes(file.key)} /> : null ) : null
                        }
                    </ScrollBarCustom>
                    <ScrollBarCustom>
                        {
                            listFile?.length! > 0 ? listFile?.map((file, i) =>  
                                i < listFile.length / 2 ? 
                                    <Element 
                                    key={file.key} 
                                    type="file" 
                                    file={file} 
                                    addToDownload={(data) => setListDownload((pre) => [...pre, data])}
                                    checked={appState.downloadMultipleFile.keys.includes(file.key)} /> : null ) : null
                        }
                    </ScrollBarCustom>
                </MainContainer>
                <ContainerButton>
                    <Button 
                    disabled={listDownload.length === 0} 
                    onClick={handleDownload} 
                    variant='contained' 
                    color='primary'>
                        <DownloadIcon fontSize='small' />&nbsp;&nbsp; Download {listDownload.length} selected file</Button>
                </ContainerButton>
            </ModalContainer>
        </Modal>
    </>
  )
}

const ContainerButton = styled.div`
    margin-top: 30px;
    text-align: center;
`

const ModalContainer = styled.div`
    width: 80%;
    height: 80%;
    margin-left: auto;
    margin-right: auto;
    border-radius: 10px;
    margin-top: 5%;
    padding: 15px;
`

const MainContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 10px;
`

const ScrollBarCustom = styled.div`
    flex-direction: column;
    max-height: calc(100vh - 300px);
    overflow-y: scroll;
    /* width: 330px; */
  &::-webkit-scrollbar-thumb {
    background-color: #d6dee1;
    border-radius: 20px;
    border: 6px solid transparent;
    background-clip: content-box;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }

  &::-webkit-scrollbar {
    width: 20px;
  }
`

const Element = (
    { type, file, addToDownload, checked }: 
    { type: string, file: FileInfo, addToDownload: (data: { name: string, url: string }) => void, checked: boolean }) => {

    const fileName = file.name.length > 20 ? file.name.slice(0, 19) + "..." : file.name
    
    useEffect(() => {
        if (checked) {
            console.log(document.getElementById(file.key))
            document.getElementById(file.key)?.scrollIntoView({ behavior: "smooth" })
        }
    },[checked])

    const handleChecked = (checked: boolean) => {
        if (!checked) {
            addToDownload({
                name: file.name,
                url: file.url
            })
        }
    }

    return (
        <>
            {
                type === "image" ? <div id={file.key} className="block mt-2" style={{width: "300px", marginLeft: "10px"}}>
                    <div className="box dark:bg-dark-3 relative flex items-center px-4 py-3">
                        <div className="w-10 h-10 flex-none image-fit mr-1">
                            {
                                type === "image" ? <Image 
                                src={file.url}
                                width={64} 
                                height={64} 
                                alt='' 
                                className="rounded-md" /> : null
                            }

                        </div>
                        <div className="ml-2 overflow-hidden">
                            <a href="javascript:void(0)" className="font-medium">{fileName}</a>
                            <div className="flex items-center text-xs">
                                <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">{Number(file.size / 1024 / 1024).toFixed(1)} MB</div>
                            </div>
                        </div>
                        <input 
                        className="form-check-switch ml-auto" 
                        type="checkbox" 
                        name="addMember"
                        defaultChecked={checked}
                        onChange={(e) => handleChecked(e.target.defaultChecked)}/>
                    </div>
                </div> : null
            }
            {
                type === "file" ? <div style={{width: "300px", height: "64px", marginLeft: "10px"}} className="shared-file box border-gray-200 dark:border-dark-5 flex items-center p-3 border rounded-md mt-2">
                    <div className="shared-file__icon text-white w-12 flex-none bg-contain relative bg-no-repeat bg-center block">
                        <div className="absolute m-auto top-0 left-0 right-0 bottom-0 flex items-center justify-center">{file.extension.toUpperCase()}</div>
                    </div>
                    <div className="w-full ml-3">
                        <div className="text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium truncate">{fileName}</div>
                        <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">{Number((file?.size! / 1024 / 1024).toFixed(1))} MB</div>
                    </div>
                    <div>
                        <input 
                        className="form-check-switch ml-auto" 
                        type="checkbox" 
                        name="addMember"
                        defaultChecked={checked}
                        onChange={(e) => handleChecked(e.target.defaultChecked)}/>
                    </div>
                </div> : null
            }
        </>
        
    )
}
