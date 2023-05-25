import { ActionBtn, ActionBtnActive, Video, VideoGrid } from "@/components/VideoCallScreen/VideoCallScreenStyled";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import CallEndIcon from '@mui/icons-material/CallEnd';
import MicIcon from '@mui/icons-material/Mic';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import OneToOneScreen from "@/components/OneToOneScreen/OneToOneScreen";
import { Button } from "@mui/material";
import { toast } from "react-toastify";

export default function VideoCall() {
    
    const [user] = useAuthState(auth);
    
    const [showCam, setShowCam] = useState(false);
    const [showMic, setShowMic] = useState(true);

    const [second, setSecond] = useState(0);
    const [minute, setMinute] = useState(0);

    const socketRef: any = useRef();
// 
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!)

    useEffect(() => {
        // socket.on("response-disconnect-call", (data: any) => {
        //     let response = JSON.parse(data);
        //     toast(`${response.name} disconnected the call`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
        // })
        // return () => {
        //     socket.disconnect();
        // }
    },[])

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

    function useInterval(callback: any, delay: any) {
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

    const handleShowCam = () => {
        setShowCam(!showCam);
    }

    const handleShowMic = () => {
        setShowMic(!showMic);
    }

    return (
        <Container>
            <OneToOneScreen />
            <ActionContainer className="d-flex mt-2">
                {
                    showCam ? <ActionBtnActive onClick={() => setShowCam(true)}>
                        <VideoCameraFrontIcon fontSize="large" />
                    </ActionBtnActive> : <ActionBtn onClick={handleShowCam}>
                        <VideoCameraFrontIcon fontSize="large" />
                    </ActionBtn>
                }
                <CenterContainer>
                    <TimeContainer>
                        { formatNumber(minute) + ":" + formatNumber(second) }
                    </TimeContainer>
                    
                    <RejectBtn variant="contained" color='error'>
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

const ActionContainer = styled.div``

const RejectBtn = styled(Button)`
    width: max-content;
`
const Container = styled.div`
    background-color: hsl(0, 0%, 13.6%);
    /* width: 100%; */
    height: 100vh;
`
const CenterContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px 0;
`

const TimeContainer = styled.div`
    text-align: center;
    color: white;
    margin-bottom: 20px;
`
const ShowCamBtn = styled.button`
    border-radius: 50%;
    border: none;
    padding: 15px;
    color: white;
`