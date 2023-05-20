import { ActionBtn, ActionBtnActive, Video, VideoGrid } from "@/components/VideoCallScreen/VideoCallScreenStyled";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import MicIcon from '@mui/icons-material/Mic';

export default function VideoCall({callVideoStatus}: any) {

    const router = useRouter();
    const [showCam, setShowCam] = useState(false);
    const [showMic, setShowMic] = useState(true);

    // const callVideoOneToOne = () => {
        import('peerjs').then(({ default: Peer }) => {
            const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL! ?? window.location.host);
            // const videoGrid = document.getElementById('video-grid');
            const peers: any = {};
            const myPeer = new Peer(undefined!, {
                host: '/'
            });
    
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            }).then(stream => {
                myPeer.on('call', call => {
                    call.answer(stream)

                    const video: HTMLVideoElement = document.getElementById('video-element') as HTMLVideoElement
                    video.muted = true;
                    
                    call.on('stream', userVideoStream => {
                        setVideoStream(video, userVideoStream);
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
                socket.emit('join-room', router.query.roomId, id);
            })
    
            const connectToNewUser = (userId: any, stream: any) => {
                const call = myPeer.call(userId, stream);
                const video = document.createElement('video');
                video.style.width = '300px';
                video.style.height = '300px';
                video.style.objectFit = 'cover';
                call.on('stream', userVideoStream => {
                    setVideoStream(video, userVideoStream);
                })
                call.on('close', () => {
                    video.remove();
                })
                peers[userId] = call
            }
    
            const setVideoStream = (video: any, stream: any) => {
                video.srcObject = stream;
                video.addEventListener('loadedmetadata', () => {
                    video.play()
                })
                // videoGrid?.append(video)
            }
        });
    // }

    // const callVideoOneToOne = () => {

    // }

    const callVideoOneToMany = () => {

    }

    // import('peerjs').then(({ default: Peer }) => {
    //     const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
    //     const videoGrid = document.getElementById('video-grid');
    //     const peers: any = {};
    //     const myPeer = new Peer(undefined!, {
    //         host: '/'
    //     });
    //     const myVideo = document.createElement('video');
    //     myVideo.style.width = '100%';
    //     myVideo.style.height = '100%';
    //     myVideo.style.objectFit = 'cover';
    //     myVideo.style.borderRadius = '10px';
    //     myVideo.muted = true;

    //     navigator.mediaDevices.getUserMedia({
    //         video: true,
    //         audio: true
    //     }).then(stream => {
    //         addVideoStream(myVideo, stream)
            
    //         myPeer.on('call', call => {
    //             call.answer(stream)
    //             const video = document.createElement('video')
    //             video.style.width = '100%';
    //             video.style.height = '100%';
    //             video.style.objectFit = 'cover';
    //             myVideo.style.borderRadius = '10px';

    //             call.on('stream', userVideoStream => {
    //                 addVideoStream(video, userVideoStream);
    //             })
    //         })

    //         socket.on('user-connected', userId => {
    //             connectToNewUser(userId, stream);
    //         })
    //     })

    //     socket.on('user-disconnected', userId => {
    //         if(peers[userId]) peers[userId].close()
    //     })

    //     myPeer.on('open', id => {
    //         socket.emit('join-room', router.query.roomId, id);
    //     })

    //     const connectToNewUser = (userId: any, stream: any) => {
    //         const call = myPeer.call(userId, stream);
    //         const video = document.createElement('video');
    //         video.style.width = '100%';
    //         video.style.height = '100%';
    //         video.style.objectFit = 'cover';
    //         call.on('stream', userVideoStream => {
    //             addVideoStream(video, userVideoStream);
    //         })
    //         call.on('close', () => {
    //             video.remove();
    //         })
    //         peers[userId] = call
    //     }

    //     const addVideoStream = (video: any, stream: any) => {
    //         video.srcObject = stream;
    //         video.addEventListener('loadedmetadata', () => {
    //             video.play()
    //         })
    //         videoGrid?.append(video)
    //     }
    // });

    const handleShowCam = () => {

    }

    const handleShowMic = () => {
        
    }

    return (
        <>
            {/* {
                callVideoStatus === 'one-to-one' ? <Video></Video> : null
            }
            {
                callVideoStatus === 'one-to-many' ? <Video></Video> : null
            } */}
            {/* <VideoGrid id='video-grid'>
            </VideoGrid> */}
            <Video id='video-element'>

            </Video>
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