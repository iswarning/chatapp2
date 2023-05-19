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
import popupCenter from "@/utils/popupCenter";

export default function VideoCallScreen({statusCall,photoURL,recipientId , chatId}: any) {

    const [statusVideo, setStatusVideo] = useState(statusCall);

    const [user] = useAuthState(auth);
    
    const [showCam, setShowCam] = useState(false);
    const [showMic, setShowMic] = useState(true);
    const socketRef: any = useRef();

    const router = useRouter();

    useEffect(() => {
        if(statusCall === 'Calling') {
            console.log(1212121)
            socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
            socketRef.current.emit("call-video", user?.uid, recipientId, chatId);
        }
        
        // getVideoStream();
    },[])

    const handleAcceptCall = () => {

    }

    // const getVideoStream = () => {
    //     import('peerjs').then(({ default: Peer }) => { 
            
    //         const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
    //         const videoGrid = document.getElementById('video-grid');
    //         const peers: any = {};

    //         const myPeer = new Peer(undefined!, {
    //             host: '/',
    //         });

    //         const myVideo = document.createElement('video');
    //         myVideo.style.width = '100%';
    //         myVideo.style.height = '100%';
    //         myVideo.style.objectFit = 'cover';
    //         myVideo.style.paddingLeft = 'auto';
    //         myVideo.style.paddingRight = 'auto';
    //         myVideo.muted = !showMic;
            
    //         navigator.mediaDevices.getUserMedia({
    //             video: showCam,
    //             audio: true
    //         }).then((stream: any) => {
    //             myPeer.on('call', call => {
    //                 call.answer(stream)
    //                 const video = document.createElement('video')
    //                 video.style.width = '100%';
    //                 video.style.height = '100%';
    //                 video.style.objectFit = 'cover';
    //                 call.on('stream', userVideoStream => {
    //                     addVideoStream(video, userVideoStream);
    //                 })
    //             })
    //             socket.on('user-connected', userId => {
    //                 connectToNewUser(userId, stream);
    //             })
    //         })

    //         socket.on('user-disconnected', userId => {
    //             if(peers[userId]) peers[userId].close()
    //         })

    //         myPeer.on('open', id => {
    //             socket.emit('join-room', uuidv4(), user?.email);
    //         })

    //         const connectToNewUser = (userId: any, stream: any) => {
    //             const call = myPeer.call(userId, stream);
    //             const video = document.createElement('video');
    //             video.style.width = '100%';
    //             video.style.height = '100%';
    //             video.style.objectFit = 'cover';
    //             call.on('stream', userVideoStream => {
    //                 addVideoStream(video, userVideoStream);
    //             })
    //             call.on('close', () => {
    //                 video.remove();
    //             })
    //             peers[userId] = call
    //         }

    //         const addVideoStream = (video: any, stream: any) => {
    //             video.srcObject = stream;
    //             video.addEventListener('loadedmetadata', () => {
    //                 video.play()
    //             })
    //             videoGrid?.append(video);
    //         }
    //     })

    // }

    // const handleShowCam = () => {
    //     if(showCam || showMic) {
    //         popupCenter({url: router.basePath + "/video-call/" + chatId , title: '_blank', w: 400, h: 900});
    //     }
    // }

    // const handleShowMic = () => {
    //     if(!showCam && !showMic) {
    //         setShowCam(!showMic);
    //     }
    // }

    return (
            <VideoCalling>
                <UserContainer>

                    <ContentCenter>
                        <Pulse> <UserAvatar src={photoURL}/> </Pulse>
                    </ContentCenter>
                    {/* {
                        showCam ?  <VideoGrid id='video-grid'>
                            
                        </VideoGrid>
                        : 
                            <ContentCenter>
                                <Pulse> <UserAvatar src={photoURL}/> </Pulse>
                            </ContentCenter>
                        
                    } */}
                    
                    <StatusCalling>
                        {
                            statusVideo === 'Called' ? '' : statusVideo
                        }
                    </StatusCalling>
                    {/* {
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
                    } */}
                    <BtnContainer>
                        {
                            statusVideo === 'Incoming Call' ? <><BtnRejectCall>
                                <CallEndIcon fontSize="large"/>
                            </BtnRejectCall>
                            <BtnAcceptCall onClick={handleAcceptCall}>
                                <CallIcon fontSize="large"/>
                            </BtnAcceptCall></> : <BtnRejectCall title="Cancel">
                                <CallEndIcon fontSize="large"/>
                            </BtnRejectCall>
                        }
                    </BtnContainer>
                </UserContainer>
            </VideoCalling>
    )
}