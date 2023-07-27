import { Modal } from '@mui/material'
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectChatState } from '@/redux/chatSlice';

export default function ModalVideoCall({ token }: { token: string }) {

    const chatState = useSelector(selectChatState)
    const [videoCall, setVideoCall] = useState(true);

    const AgoraUIKit = dynamic(() => import('agora-react-uikit'), {
        ssr: false
    });

    const channel = chatState.currentChat!

    const rtcProps = {
        appId: process.env.NEXT_PUBLIC_AGORA_APP_ID!,
        channel: "test",
        token: "007eJxTYDDZy97J/OpJdIT2Ow79ksPpHV6+/k4LNpsU2M+NWZASy6fAkJicagBEJsmmSakmxskWSakWhuaWRpamSYkWSZYWiRq6h1IaAhkZ2BK/MzEyQCCIz8JQklpcwsAAAJ2vHR4="
    };

    const callbacks = {
        EndCall: () => setVideoCall(false),
    };

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        .then(stream => console.log(stream)) 
    },[token])


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
