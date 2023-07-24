import { Modal } from '@mui/material'
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectChatState } from '@/redux/chatSlice';
import { generateRtcToken } from '@/services/UserService';
import { selectAppState } from '@/redux/appSlice';

export default function ModalVideoCall() {

    const chatState = useSelector(selectChatState)
    const appState = useSelector(selectAppState)
    const [videoCall, setVideoCall] = useState(false);
    const [token, setToken] = useState("")

    const AgoraUIKit = dynamic(() => import('agora-react-uikit'), {
        ssr: false
    });

    const channel = chatState.currentChat!

    useEffect(() => {
        generateRtcToken({
            chatRoomId: channel,
            userId: appState.userInfo._id!
        })
        .then(setToken)
        .finally(() => setVideoCall(true))
    },[])


    const rtcProps = {
        appId: process.env.NEXT_PUBLIC_AGORA_APP_ID!,
        channel: channel,
        token: token
    };

    const callbacks = {
        EndCall: () => setVideoCall(false),
    };


  return (
    <>
        <Modal open={true} style={{background: "white"}}>
            <>
                {
                videoCall ? (
                    <div style={{display: 'flex', width: '100vw', height: '100vh'}}>
                        <AgoraUIKit rtcProps={rtcProps} callbacks={callbacks} />
                    </div>
                ) : <div></div>
                }
            </>
        </Modal>
    </>
  )
}
