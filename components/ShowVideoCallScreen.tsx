import { Button } from '@mui/material'
import React, { useState } from 'react'
import styled from 'styled-components'
import OneToOneScreen from './OneToOneScreen/OneToOneScreen'
import { ActionBtn, ActionBtnActive } from './VideoCallScreen/VideoCallScreenStyled'
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
            <OneToOneScreen chatRoomId={appState.currentChat.id} />
            <ActionContainer>
                {
                    showCam ? <ActionBtnActive onClick={() => setShowCam(true)}>
                        <VideoCameraFrontIcon fontSize="large" />
                    </ActionBtnActive> : <ActionBtn onClick={handleShowCam}>
                        <VideoCameraFrontIcon fontSize="large" />
                    </ActionBtn>
                }
                <CenterContainer>
                    <RejectBtn variant="contained" color='error' onClick={() => dispatch(setShowVideoCallScreen(false))}>
                        <CallEndIcon/>
                    </RejectBtn>
                </CenterContainer>
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

const ActionContainer = styled.div`
    display: flex;
`

const RejectBtn = styled(Button)`
    width: max-content;
`
const Container = styled.div`
    background-color: hsl(0, 0%, 13.6%);
    /* width: 100%; */
    height: 100vh;
`
const CenterContainer = styled.div`
    padding: 10px 0;
`
const ShowCamBtn = styled.button`
    border-radius: 50%;
    border: none;
    padding: 15px;
    color: white;
`
