import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import OneToOneScreen from '../OneToOneScreen/OneToOneScreen'
import { ActionBtn, ActionBtnActive } from './VideoCallScreenStyled'
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import { StatusCallType, selectAppState, setShowVideoCallScreen, setStatusCall } from '@/redux/appSlice'
import {useSelector,useDispatch} from 'react-redux'
import { toast } from 'react-toastify'
import VideocamIcon from '@mui/icons-material/Videocam';
export default function ShowVideoCallScreen() {

    const [showCam, setShowCam] = useState(true);
    const [showMic, setShowMic] = useState(true);
    const [stream, setStream] = useState<MediaStream>()
    const appState = useSelector(selectAppState)
    const dispatch = useDispatch()

    useEffect(() => {
        appState.socket.on("response-disconnect-call", (res) => {
            let data = JSON.parse(res);
            if(data.recipient.includes(appState.userInfo.email)) {
                toast(`${data.notify}`, { type: "info", hideProgressBar: true, autoClose: 5000,  })
                dispatch(setStatusCall(StatusCallType.DISCONNECT_CALL))
            }
        })
        return () => {
            appState.socket.disconnect()
        }
    },[])

    const handleShowCam = () => {
        setShowCam(!showCam);
        navigator.mediaDevices.getUserMedia({
            video: showCam,
            audio: showMic
        }).then((stream) => setStream(stream))
    }

    const handleShowMic = () => {
        setShowMic(!showMic);
    }

    // async function getStream() {
    //     return await navigator.mediaDevices.getUserMedia({
    //         video: showCam,
    //         audio: showMic
    //     })
    // }

    const handleRejectCall = () => {
        dispatch(setShowVideoCallScreen(false))
        let data = {
            isGroup: appState.dataVideoCall.isGroup,
            sender: appState.dataVideoCall.sender,
            notify: appState.userInfo.fullName + " has left the room",
            recipient: appState.currentChat.isGroup ? appState.currentChat.users : appState.dataVideoCall.recipient
        }
        appState.socket.emit("disconnect-call", JSON.stringify(data))
        dispatch(setStatusCall(StatusCallType.DISCONNECT_CALL))
    }

  return (
    <Container>
        <ContainerMainVideo><OneToOneScreen chatRoomId={appState.dataVideoCall.chatId} showCam={showCam} showMic={showMic} disconnectCall={handleRejectCall} /></ContainerMainVideo>
            
            <ActionContainer>
                {
                    showCam ? <ActionBtnActive onClick={() => setShowCam(true)}>
                        <VideocamIcon fontSize="large" />
                    </ActionBtnActive> : <ActionBtn onClick={handleShowCam}>
                        <VideocamIcon fontSize="large" />
                    </ActionBtn>
                }
                <RejectBtn variant="contained" color='error' onClick={handleRejectCall}>
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
