import { ActionBtn, ActionBtnActive, Video, VideoGrid } from "@/components/VideoCallScreen/VideoCallScreenStyled";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import MicIcon from '@mui/icons-material/Mic';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import OneToOneScreen from "@/components/OneToOneScreen/OneToOneScreen";

export default function VideoCall({callVideoStatus}: any) {
    
    const [user] = useAuthState(auth);
    
    const [showCam, setShowCam] = useState(false);
    const [showMic, setShowMic] = useState(true);

    const [second, setSecond] = useState(0);
    const [minute, setMinute] = useState(0);

    useEffect(() => {
        console.log(showCam);
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
        console.log(showCam);
    }

    const handleShowMic = () => {
        setShowMic(!showMic);
    }

    return (
        <>
            { !showCam && !showMic ?  null : <OneToOneScreen cam={showCam} mic={showMic} /> }
            <div className="d-flex mt-2">
                { formatNumber(minute) + ":" + formatNumber(second) }
                {
                    showCam ? <ActionBtnActive onClick={() => setShowCam(true)}>
                        <VideoCameraFrontIcon fontSize="large" />
                    </ActionBtnActive> : <ActionBtn onClick={handleShowCam}>
                        <VideoCameraFrontIcon fontSize="large" />
                    </ActionBtn>
                }
                {
                    showMic ? <ActionBtnActive onClick={handleShowMic}>
                        <MicIcon fontSize="large" />
                    </ActionBtnActive> : <ActionBtn onClick={handleShowMic}>
                        <MicIcon fontSize="large" />
                    </ActionBtn>
                }
            </div>
            
        </>
    )
    
}

const ShowCamBtn = styled.button`
    border-radius: 50%;
    border: none;
    padding: 15px;
    color: white;
`