import { Button } from '@mui/material'
import React, { useState } from 'react'
import styled from 'styled-components'
import OneToOneScreen from '../OneToOneScreen/OneToOneScreen'
import { ActionBtn, ActionBtnActive } from './VideoCallScreenStyled'
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import { selectAppState, setShowVideoCallScreen } from '@/redux/appSlice'
import {useSelector,useDispatch} from 'react-redux'

export default function ShowVideoCallScreen() {

    const [showCam, setShowCam] = useState(false);
    const [showMic, setShowMic] = useState(true);
    const appState = useSelector(selectAppState)
    const dispatch = useDispatch()

    const handleShowCam = () => {
        setShowCam(!showCam);
    }

    const handleShowMic = () => {
        setShowMic(!showMic);
    }

  return (
    <Container>
        <ContainerMainVideo><OneToOneScreen chatRoomId={appState.dataVideoCall.chatId} /></ContainerMainVideo>
            
            <ActionContainer>
                {
                    showCam ? <ActionBtnActive onClick={() => setShowCam(true)}>
                        <VideoCameraFrontIcon fontSize="large" />
                    </ActionBtnActive> : <ActionBtn onClick={handleShowCam}>
                        <VideoCameraFrontIcon fontSize="large" />
                    </ActionBtn>
                }
                <RejectBtn variant="contained" color='error' onClick={() => dispatch(setShowVideoCallScreen(false))}>
                    <CallEndIcon/>
                </RejectBtn>
                {
                    showMic ? <ActionBtnActive onClick={handleShowMic}>
                        <MicIcon fontSize="large" />
                    </ActionBtnActive> : <ActionBtn onClick={handleShowMic}>
                        <MicIcon fontSize="large" />
                    </ActionBtn>
                }
            </ActionContainer>
            
        </Container>
  )
}

const ContainerMainVideo = styled.div`
    width: 600px;
    height: 450px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 50px;
    margin-bottom: 50px;
`

const ActionContainer = styled.div`
    display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
`

const RejectBtn = styled(Button)`
    /* width: max-content; */
`
const Container = styled.div`
    /* width: 100%; */
    /* height: 100%; */
    /* position: relative; */
`
/* const CenterContainer = styled.div`
    padding: 10px 0;
` */
const ShowCamBtn = styled.button`
    border-radius: 50%;
    border: none;
    padding: 15px;
    color: white;
`
