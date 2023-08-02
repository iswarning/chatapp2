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
import SearchIcon from '@mui/icons-material/Search';

export default function DownloadMultipleFile() {
    const appState = useSelector(selectAppState)
    const chatState = useSelector(selectChatState)
    const dispatch = useDispatch()
    const [inputSearchImage, setInputSearchImage] = useState("")
    const [inputSearchFile, setInputSearchFile] = useState("")
    const [filteredDataImage, setFilteredDataImage] = useState<FileInfo[]>([])
    const [filteredDataFile, setFilteredDataFile] = useState<FileInfo[]>([])

    const listImage = chatState.listChat[chatState.currentChat.index].listImage
    const listFile = chatState.listChat[chatState.currentChat.index].listFile

    const [listDownload, setListDownload] = useState<{ name: string, url: string }[]>(
        listImage?.filter((img) => appState.downloadMultipleFile.keys.includes(img.key)).map((img) => {  return { name: img.name, url: img.url } })!
    )

    const handleDownload = async() => {
        for(const data of listDownload) {
            await downloadFile(data.url, data.name)
        }
    }

    const ButtonInInput = styled.span`
        padding: 8px;
        width: 30px;
        margin-left: -40px;
        color: #8386ba;
        cursor: pointer;
    `

    const handleClickSearchImage = () => {
        setFilteredDataImage(
            listImage?.filter((item) =>
            item.name.indexOf(inputSearchImage) !== -1)!
        )
    }

    const handleClickSearchFile = () => {
        setFilteredDataFile(
            listFile?.filter((item) =>
            item.name.indexOf(inputSearchFile) !== -1)!
        )
    }

  return (
    <>
        <Modal open={true} onClose={() => setDownloadMultipleFile(!appState.downloadMultipleFile.isShow, [], dispatch)}>
            <ModalContainer>
                <div className='flex ml-2'>
                    <h1>Download Multiple File</h1>
                    <span className='ml-auto cursor-pointer'>
                        <ClearIcon fontSize='small' onClick={() => setDownloadMultipleFile(!appState.downloadMultipleFile.isShow, [], dispatch)} />
                    </span>
                </div>
                <div className='mt-2 ml-2'>

                    <input 
                    className='form-control' 
                    placeholder='Search in images' 
                    value={inputSearchImage} 
                    onChange={(e) => setInputSearchImage(e.currentTarget.value)} 
                    style={{width: "300px"}} 
                    onKeyDown={(event) => event.key === "Enter" ? handleClickSearchImage() : null}/>

                    <ButtonInInput onClick={handleClickSearchImage}><SearchIcon fontSize='small' /></ButtonInInput>

                    <input 
                    className='form-control' 
                    placeholder='Search in files' 
                    value={inputSearchFile} 
                    onChange={(e) => setInputSearchFile(e.currentTarget.value)} 
                    style={{width: "300px", marginLeft: "35px"}}
                    onKeyDown={(event) => event.key === "Enter" ? handleClickSearchFile() : null}/>

                    <ButtonInInput onClick={handleClickSearchFile}><SearchIcon fontSize='small' /></ButtonInInput>

                </div>
                <MainContainer>
                    <ScrollBarCustom>
                        {
                            listImage?.length! > 0 && filteredDataImage.length === 0 ? listImage?.map((file, i) =>  
                                    <Element 
                                    key={file.key} 
                                    type="image" 
                                    file={file} 
                                    addToDownload={(data) => setListDownload((pre) => [...pre, data])}
                                    removeFromDownload={(name) => setListDownload(listDownload.filter((p) => p.name !== name))}
                                    index={i}
                                    checked={appState.downloadMultipleFile.keys.includes(file.key)} /> ) : null
                        }
                        {
                            filteredDataImage.length > 0 ? filteredDataImage.map((file, i) =>  
                            <Element 
                            key={file.key} 
                            type="image" 
                            file={file} 
                            addToDownload={(data) => setListDownload((pre) => [...pre, data])}
                            removeFromDownload={(name) => setListDownload(listDownload.filter((p) => p.name !== name))}
                            index={i}
                            checked={appState.downloadMultipleFile.keys.includes(file.key)} /> ) : null
                        }
                    </ScrollBarCustom>
                    <ScrollBarCustom>
                        {
                            listFile?.length! > 0 && filteredDataFile.length === 0 ? listFile?.map((file, i) => 
                                    <Element 
                                    key={file.key} 
                                    type="file" 
                                    file={file} 
                                    addToDownload={(data) => setListDownload((pre) => [...pre, data])}
                                    removeFromDownload={(name) => setListDownload(listDownload.filter((p) => p.name !== name))}
                                    index={i}
                                    checked={appState.downloadMultipleFile.keys.includes(file.key)} /> ) : null
                        }
                        {
                            filteredDataFile.length > 0 ? filteredDataFile.map((file, i) =>  
                            <Element 
                            key={file.key} 
                            type="file" 
                            file={file} 
                            addToDownload={(data) => setListDownload((pre) => [...pre, data])}
                            removeFromDownload={(name) => setListDownload(listDownload.filter((p) => p.name !== name))}
                            index={i}
                            checked={appState.downloadMultipleFile.keys.includes(file.key)} /> ) : null
                        }
                    </ScrollBarCustom>
                </MainContainer>
                <ContainerButton>
                    <Button 
                    disabled={listDownload.length === 0} 
                    onClick={handleDownload} 
                    variant='contained' 
                    color='primary'
                    className='focus:outline-none'>
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
    width: 700px;
    height: 90%;
    margin-top: 2.5%;
    margin-left: auto;
    margin-right: auto;
    border-radius: 10px;
    padding: 15px;
    background: #F1F6FB;
`

const MainContainer = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 10px;
`

const ScrollBarCustom = styled.div`
    flex-direction: column;
    max-height: calc(100vh - 280px);
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
    { type, file, addToDownload, removeFromDownload, index, checked }: 
    { 
        type: string, 
        file: FileInfo, 
        addToDownload: (data: { name: string, url: string }) => void, 
        removeFromDownload: (name: string) => void, 
        index: number,
        checked: boolean 
    }
) => {

    const fileName = file.name.length > 20 ? file.name.slice(0, 19) + "..." : file.name
    
    useEffect(() => {
        if (checked) {
            document.getElementById(file.key)?.scrollIntoView({ behavior: "smooth" })
        }
    },[checked])

    const handleChecked = (checked: boolean) => {
        if (checked) {
            addToDownload({
                name: file.name,
                url: file.url
            })
        } else {
            removeFromDownload(file.name)
        }
    }

    return (
        <>
            {
                type === "image" ? <div id={file.key} className="block mt-2" style={{width: "300px", height: "64px", marginLeft: "10px"}}>
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
                                <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">{Number(file.size / 1024).toFixed(1)} KB</div>
                            </div>
                        </div>
                        <input 
                        className="form-check-switch ml-auto" 
                        type="checkbox" 
                        name="addMember"
                        defaultChecked={checked}
                        onChange={(e) => handleChecked(e.target.checked)}/>
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
                        onChange={(e) => handleChecked(e.target.checked)}/>
                    </div>
                </div> : null
            }
        </>
        
    )
}
