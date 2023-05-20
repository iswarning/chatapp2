import { useEffect, useRef, useState } from "react"
import { ActionBtn, ActionBtnActive, ActionGroup, BtnAcceptCall, BtnContainer, BtnRejectCall, ContentCenter, Pulse, RecipientName, StatusCalling, UserAvatar, UserContainer, Video, VideoCalling, VideoGrid } from "./VideoCallScreenStyled";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import MicIcon from '@mui/icons-material/Mic';
import { useRouter } from "next/router";
import { v4 as uuidv4 } from 'uuid';
import { io } from "socket.io-client";

export default function VideoCallScreen({ statusCall, photoURL, senderId, recipientId, chatId, onClose }: any) {

    const [statusVideo, setStatusVideo] = useState(statusCall);

    const [user] = useAuthState(auth);
    
    const [showCam, setShowCam] = useState(false);
    const [showMic, setShowMic] = useState(true);
    const [second, setSecond] = useState(0);
    const [minute, setMinute] = useState(0);
    const router = useRouter();

    useInterval(() => {
        setSecond(second + 1);
        if(second == 59) {
            setSecond(0);
            setMinute((oldMinute) => oldMinute + 1)
        }
    }, 1000);

    function formatNumber(num: number){
        if(num.toString().length === 1) 
            return '0' + num;
        return num;
    }

    function useInterval(callback, delay) {
        const savedCallback: any = useRef();
      
        // Remember the latest callback.
        useEffect(() => {
          savedCallback.current = callback;
        }, [callback]);
      
        // Set up the interval.
        useEffect(() => {
          let id = setInterval(() => {
            savedCallback.current();
          }, delay);
          return () => clearInterval(id);
        }, [delay]);
    }

    const handleAcceptCall = () => {
        setStatusVideo('Called');
    }

    const handleRejectCall = () => {

        onClose();
        
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!,{
            path: process.env.NEXT_PUBLIC_SOCKET_IO_PATH
        });

        if (statusVideo === "Calling") {
            socket.emit("reject-call", senderId, recipientId, chatId)
        }

        if (statusVideo === "Incoming Call") {
            socket.emit("reject-call", recipientId, senderId, chatId)
        }
        
    }

    const handleShowCam = () => {
        setShowCam(!showCam);
    }

    const handleShowMic = () => {
        setShowMic(!showMic);
    }

    return (
            <VideoCalling>
                <UserContainer>

                    <ContentCenter>
                        <Pulse> <UserAvatar src={photoURL}/> </Pulse>
                    </ContentCenter>                  
                    <StatusCalling>
                        {
                            statusVideo === 'Called' ? formatNumber(minute) + ':' + formatNumber(second) : statusVideo
                        }
                    </StatusCalling>
                    <BtnContainer>
                        {
                            statusVideo === 'Incoming Call' ? <><BtnRejectCall title="Cancel" onClick={handleRejectCall}>
                                <CallEndIcon fontSize="large"/>
                            </BtnRejectCall>
                            <BtnAcceptCall onClick={handleAcceptCall}>
                                <CallIcon fontSize="large"/>
                            </BtnAcceptCall></> : <BtnRejectCall title="Cancel" onClick={handleRejectCall}>
                                <CallEndIcon fontSize="large"/>
                            </BtnRejectCall>
                        }
                    </BtnContainer>
                </UserContainer>
            </VideoCalling>
    )
}