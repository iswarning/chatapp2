import { ActionBtn, ActionBtnActive, Video, VideoGrid } from "@/components/VideoCallScreen/VideoCallScreenStyled";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import MicIcon from '@mui/icons-material/Mic';

export default function VideoCall({callVideoStatus}: any) {

    const router = useRouter();
    const [showCam, setShowCam] = useState(true);
    const [showMic, setShowMic] = useState(true);
    const socketRef: any = useRef();
    const videoRef: any = useRef(null);

    useEffect(() => {
        import('peerjs').then(({ default: Peer }) => {
            
            socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
            const peers: any = {};
            const myPeer = new Peer();
    
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(stream => {
                myPeer.on('call', call => {
                    call.answer(stream)

                    videoRef.current.muted = true;
                    
                    call.on('stream', userVideoStream => {
                        videoRef.current.srcObject = userVideoStream;
                    })
                })
    
                socketRef.current.on('user-connected', (userId: any) => {
                    connectToNewUser(userId, stream);
                })
            })
    
            // socketRef.current.on('user-disconnected', (userId: any) => {
            //     if(peers[userId]) peers[userId].close()
            // })
    
            myPeer.on('open', id => {
                socketRef.current.emit('join-room', router.query.roomId, id);
            })
    
            const connectToNewUser = (userId: any, stream: any) => {
                const call = myPeer.call(userId, stream);
                call.on('stream', userVideoStream => {
                    videoRef.current.srcObject = userVideoStream;
                })
                // peers[userId] = call
            }
    
        });
    },[])

    const handleShowCam = () => {
        setShowCam(!showCam);
    }

    const handleShowMic = () => {
        setShowCam(!showMic);
    }

    return (
        <>
            <Video ref={videoRef} autoPlay />
            <div className="d-flex mt-2">
                {
                    showCam ? <ActionBtnActive onClick={handleShowCam}>
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