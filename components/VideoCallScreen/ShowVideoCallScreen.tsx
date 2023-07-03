import { Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import OneToOneScreen from '../OneToOneScreen/OneToOneScreen'
import { ActionBtn, ActionBtnActive } from './VideoCallScreenStyled'
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import { selectAppState } from '@/redux/appSlice'
import {useSelector,useDispatch} from 'react-redux'
import { toast } from 'react-toastify'
import VideocamIcon from '@mui/icons-material/Videocam';
import getRecipientEmail from '@/utils/getRecipientEmail'
import { selectChatState } from '@/redux/chatSlice'
import { StatusCallType, selectVideoCallState, setGlobalVideoCallState } from '@/redux/videoCallSlice'
export default function ShowVideoCallScreen({stream}: any) {

    const [showCam, setShowCam] = useState(true);
    const [showMic, setShowMic] = useState(true);
    // const [stream, setStream] = useState<MediaStream>()
    const chatState = useSelector(selectChatState)
    const videoCallState = useSelector(selectVideoCallState)
    const appState = useSelector(selectAppState)
    const dispatch = useDispatch()

    useEffect(() => {
        appState.socket.on("response-disconnect-call", (res) => {
            let data = JSON.parse(res);
            if(data.recipient.includes(appState.userInfo.email)) {
                toast(`${data.notify}`, { type: "info", hideProgressBar: true, autoClose: 5000,  })
                dispatch(setGlobalVideoCallState({
                    type: "setStatusCall",
                    data: StatusCallType.DISCONNECT_CALL
                }))
            }
        })
        return () => {
            appState.socket.disconnect()
        }
    },[])

    const handleShowCam = () => {
        setShowCam(!showCam);
        let actionData = {
            type: "cam",
            enabled: showCam,
            sender: appState.userInfo?.email,
            recipient: chatState.currentChat.isGroup ? chatState.currentChat.users.filter((u) => u === appState.userInfo.email) : getRecipientEmail(chatState.currentChat.users, appState.userInfo)
        }
        appState.socket.emit("action-change", JSON.stringify(actionData))
    }

    const handleShowMic = () => {
        setShowMic(!showMic);
        let actionData = {
            type: "mic",
            enabled: showMic,
            sender: appState.userInfo?.email,
            recipient: chatState.currentChat.isGroup ? chatState.currentChat.users.filter((u) => u === appState.userInfo.email) : getRecipientEmail(chatState.currentChat.users, appState.userInfo)
        }
        appState.socket.emit("action-change", JSON.stringify(actionData))
    }

    const handleRejectCall = () => {
        let data = {
            isGroup: videoCallState.dataVideoCall.isGroup,
            sender: videoCallState.dataVideoCall.sender,
            notify: appState.userInfo.fullName + " has left the room",
            recipient: chatState.currentChat.isGroup ? chatState.currentChat.users : videoCallState.dataVideoCall.recipient
        }
        appState.socket.emit("disconnect-call", JSON.stringify(data))
        dispatch(setGlobalVideoCallState({
            type: "setStatusCall",
            data: StatusCallType.DISCONNECT_CALL
        }))
        dispatch(setGlobalVideoCallState({
            type: "setShowVideoCallScreen",
            data: false
        }))
    }

  return (
    <Container>
        <ContainerMainVideo><OneToOneScreen chatRoomId={videoCallState.dataVideoCall.chatId} showCam={showCam} showMic={showMic} disconnectCall={handleRejectCall} /></ContainerMainVideo>
            
            <ActionContainer>
                {
                    showCam ? <ActionBtnActive onClick={handleShowCam}>
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
