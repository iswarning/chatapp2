import { ActionBtn, ActionBtnActive, Video, VideoGrid } from "@/components/VideoCallScreen/VideoCallScreenStyled";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import MicIcon from '@mui/icons-material/Mic';

export default function VideoCall({callVideoStatus}: any) {

    const router = useRouter();
    const [showCam, setShowCam] = useState(false);
    const [showMic, setShowMic] = useState(true);
    const socketRef: any = useRef();

    import('peerjs').then(({ default: Peer }) => {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
        const videoGrid = document.getElementById('video-grid');
        const peers: any = {};
        const myPeer = new Peer();
        const myVideo = document.createElement('video');
        myVideo.style.width = '100%';
        myVideo.style.height = '100%';
        myVideo.style.objectFit = 'cover';
        myVideo.style.borderRadius = '10px';
        myVideo.muted = true;

        navigator.mediaDevices.getUserMedia({
            video: showCam,
            audio: showMic
        }).then(stream => {
            
            myPeer.on('call', call => {
                call.answer(stream)
                const video = document.createElement('video')
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.objectFit = 'cover';
                myVideo.style.borderRadius = '10px';

                call.on('stream', userVideoStream => {
                    addVideoStream(video, userVideoStream);
                })
            })

            socket.on('user-connected', userId => {
                connectToNewUser(userId, stream);
            })
            
        }).catch((err) => console.log(err))

        socket.on('user-disconnected', userId => {
            if(peers[userId]) peers[userId].close()
        })

        myPeer.on('open', id => {
            socket.emit('join-room', router.query.roomId, id);
        })

        const connectToNewUser = (userId: any, stream: any) => {
            const call = myPeer.call(userId, stream);
            const video = document.createElement('video');
            video.style.width = '100%';
            video.style.height = '100%';
            video.style.objectFit = 'cover';
            call.on('stream', userVideoStream => {
                addVideoStream(video, userVideoStream);
            })
            call.on('close', () => {
                video.remove();
            })
            peers[userId] = call
        }

        const addVideoStream = (video: any, stream: any) => {
            video.srcObject = stream;
            video.addEventListener('loadedmetadata', () => {
                video.play()
            })
            videoGrid?.append(video)
        }

        return () => {
            socket.disconnect();
        }
    }).catch((err) => console.log(err));

    const handleShowCam = () => {

    }

    const handleShowMic = () => {
        
    }

    return (
        <>
            <VideoGrid id='video-grid'>
            </VideoGrid>
            <div className="d-flex mt-2">
                <ActionBtnActive onClick={handleShowCam}>
                        <VideoCameraFrontIcon fontSize="large" />
                </ActionBtnActive>
                <ActionBtnActive onClick={handleShowMic}>
                    <MicIcon fontSize="large" />
                </ActionBtnActive>
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