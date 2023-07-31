import { setShowDownloadMultipleFile } from '@/services/CacheService'
import { Button, Modal } from '@mui/material'
import React from 'react'
import styled from 'styled-components'
import {useSelector,useDispatch} from 'react-redux'
import { selectAppState } from '@/redux/appSlice'
import Image from 'next/image'
import ClearIcon from '@mui/icons-material/Clear';
import DownloadIcon from '@mui/icons-material/Download';

export default function DownloadMultipleFile() {
    const appState = useSelector(selectAppState)
    const dispatch = useDispatch()
  return (
    <>
        <Modal open={true} onClose={() => setShowDownloadMultipleFile(!appState.showDownloadMultipleFile, dispatch)}>
            <ModalContainer>
                <div className='flex ml-2'>
                    <h3>Download Multiple File</h3>
                    <span className='ml-auto cursor-pointer'>
                        <ClearIcon fontSize='small' onClick={() => setShowDownloadMultipleFile(!appState.showDownloadMultipleFile, dispatch)} />
                    </span>
                </div>
                <MainContainer>
                    <ScrollBarCustom>
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                    </ScrollBarCustom>
                    <ScrollBarCustom>
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                    </ScrollBarCustom>
                    <ScrollBarCustom>
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                    </ScrollBarCustom>
                    <ScrollBarCustom>
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                    </ScrollBarCustom>
                    <ScrollBarCustom>
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                        <Element />
                    </ScrollBarCustom>
                </MainContainer>
                <ContainerButton>
                    <Button variant='contained' color='primary'><DownloadIcon fontSize='small' />&nbsp;&nbsp; Download selected file</Button>
                </ContainerButton>
            </ModalContainer>
        </Modal>
    </>
  )
}

const ContainerButton = styled.div`
    margin: 10px;
    text-align: center;
`

const ModalContainer = styled.div`
    width: 100%;
    height: 100%;
    background-color: #f1f1f1;
    margin-left: auto;
    margin-right: auto;
    padding: 15px;
`

const MainContainer = styled.div`
    display: flex;
    flex-direction: row;
`

const ScrollBarCustom = styled.div`
    flex-direction: column;
    max-height: calc(100vh - 100px);
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

const Element = () => {
    return (
        <div className="block mt-2" style={{width: "300px", marginLeft: "10px"}}>
            <div className="box dark:bg-dark-3 relative flex items-center px-4 py-3">
                <div className="w-10 h-10 flex-none image-fit mr-1">
                    <Image src='https://images.viblo.asia/avatar/4c4050f1-d258-4aeb-96dd-32fa60707d0a.png' width={64} height={64} alt='' className="rounded-md" />
                </div>
                <div className="ml-2 overflow-hidden">
                    <a href="javascript:void(0)" className="font-medium">File name</a>
                    <div className="flex items-center text-xs">
                        <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">extension</div>
                    </div>
                </div>
                <input 
                className="form-check-switch ml-auto" 
                type="checkbox" 
                name="addMember"/>
            </div>
        </div>
    )
}
