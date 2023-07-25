import { Modal } from '@mui/material'
import dynamic from 'next/dynamic';
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { selectChatState } from '@/redux/chatSlice';

export default function ModalVideoCall({ token }: { token: string }) {

    const chatState = useSelector(selectChatState)
    const [videoCall, setVideoCall] = useState(true);
console.log(token)
    const AgoraUIKit = dynamic(() => import('agora-react-uikit'), {
        ssr: false
    });

    const channel = chatState.currentChat!

    const rtcProps = {
        appId: process.env.NEXT_PUBLIC_AGORA_APP_ID!,
        channel: channel,
        token
    };

    const callbacks = {
        EndCall: () => setVideoCall(false),
    };


  return (
    <>
        <Modal open={true} style={{background: "white"}}>
            <>
                {
                videoCall && token ? (
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
