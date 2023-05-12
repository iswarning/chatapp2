import { useEffect, useState } from "react"
import { ActionBtn, ActionBtnActive, ActionGroup, BtnAcceptCall, BtnContainer, BtnRejectCall, StatusCalling, UserAvatar, UserContainer, Video, VideoCalling, VideoGrid } from "./VideoCallScreenStyled";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import MicIcon from '@mui/icons-material/Mic';
import { useRouter } from "next/router";
import { v4 as uuidv4 } from 'uuid';
import { io } from "socket.io-client";

export default function VideoCallScreen() {

    const [statusVideo, setStatusVideo] = useState('Called');

    const [user] = useAuthState(auth);
    
    const [showCam, setShowCam] = useState(false);
    const [showMic, setShowMic] = useState(true);

    const router = useRouter();

    useEffect(() => {
        getVideoStream();
    },[showCam])

    const handleAcceptCall = () => {
    }

    const getVideoStream = () => {
        import('peerjs').then(({ default: Peer }) => { 
            
            const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
            const videoGrid = document.getElementById('video-grid');
            const peers: any = {};

            const myPeer = new Peer(undefined!, {
                host: process.env.NEXT_PUBLIC_SOCKET_IO_URL,
            });

            const myVideo = document.createElement('video');
            myVideo.style.width = '100%';
            myVideo.style.height = '100%';
            myVideo.style.objectFit = 'cover';
            myVideo.style.paddingLeft = 'auto';
            myVideo.style.paddingRight = 'auto';
            myVideo.muted = true;

            navigator.mediaDevices.getUserMedia({
                video: showCam,
                audio: showMic
            }).then((stream: any) => {
                addVideoStream(myVideo, stream)

                myPeer.on('call', call => {
                    call.answer(stream)
                    const video = document.createElement('video')
                    video.style.width = '100%';
                    video.style.height = '100%';
                    video.style.objectFit = 'cover';
                    call.on('stream', userVideoStream => {
                        addVideoStream(video, userVideoStream);
                    })
                })
                socket.on('user-connected', userId => {
                    connectToNewUser(userId, stream);
                })
            })

            socket.on('user-disconnected', userId => {
                if(peers[userId]) peers[userId].close()
            })

            myPeer.on('open', id => {
                socket.emit('join-room', uuidv4(), id);
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
                videoGrid?.append(video);
            }
        })
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
                    {
                        showCam ?  <VideoGrid id='video-grid'>
                            
                        </VideoGrid>
                        : <>
                            <UserAvatar src={user?.photoURL!}/>
                            
                        </>
                    }
                    <StatusCalling>
                        {
                            statusVideo === 'Calling' ? 'Đang gọi' : null
                        }
                        {
                            statusVideo === 'Incoming Call' ? 'Cuộc gọi đến' : null
                        }
                        {
                            statusVideo === 'Called' ? '00.00' : null
                        }
                    </StatusCalling>
                    {
                        statusVideo === 'Called' ? <ActionGroup>
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
                        </ActionGroup>  : null
                    }
                    <BtnContainer>
                        {
                            statusVideo === 'Incoming Call' ? <><BtnRejectCall>
                                <CallEndIcon fontSize="large"/>
                            </BtnRejectCall>
                            <BtnAcceptCall onClick={handleAcceptCall}>
                                <CallIcon fontSize="large"/>
                            </BtnAcceptCall></> : <BtnRejectCall>
                                <CallEndIcon fontSize="large"/>
                            </BtnRejectCall>
                        }
                    </BtnContainer>
                </UserContainer>
            </VideoCalling>
    )
}