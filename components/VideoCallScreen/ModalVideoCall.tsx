import { Modal } from '@mui/material'
import dynamic from 'next/dynamic';
import React, {  useState } from 'react'
import { useDispatch } from 'react-redux'
import { setStatusCall } from '@/services/CacheService';
import { StatusCallType } from '@/redux/videoCallSlice';

export default function ModalVideoCall({ token, channel }: { token: string, channel: string }) {

    const [videoCall, setVideoCall] = useState(true);
    const dispatch = useDispatch();

    const AgoraUIKit = dynamic(() => import('agora-react-uikit'), {
        ssr: false
    });

    const rtcProps = {
        appId: process.env.NEXT_PUBLIC_AGORA_APP_ID!,
        channel,
        token
    };

    const callbacks = {
        EndCall: () => {
            setStatusCall(StatusCallType.DISCONNECT_CALL, dispatch)
        },
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
