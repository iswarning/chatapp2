import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { Video } from '../VideoCallScreen/VideoCallScreenStyled';
import { useRouter } from 'next/router';

export default function OneToOneScreen({cam, mic}: any) {

    const socketRef: any = useRef();
    
    const videoRef: any = useRef(null);

    const router = useRouter();

    useEffect(() => {
        if(cam && mic) {
            getVideoStreamCamAndMic();
        } else {
            getVideoStream();
        }
    },[])

    const getVideoStream = () => {
        import('peerjs').then(({ default: Peer }) => {
            
            socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
            
            const peers: any = {};
            const myPeer = new Peer();
    
            navigator.mediaDevices.getUserMedia({
                video: false,
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
    
            socketRef.current.on('user-disconnected', (userId: any) => {
                if(peers[userId]) peers[userId].close()
            })
    
            myPeer.on('open', id => {
                socketRef.current.emit('join-room', router.query.roomId, id);
            })
    
            const connectToNewUser = (userId: any, stream: any) => {
                const call = myPeer.call(userId, stream);
                call.on('stream', userVideoStream => {
                    videoRef.current.srcObject = userVideoStream;
                })
                peers[userId] = call
            }

            return () => {
                socketRef.current.disconnect();
            }

        });
    }

    const getVideoStreamCamAndMic = () => {
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
    
            socketRef.current.on('user-disconnected', (userId: any) => {
                if(peers[userId]) peers[userId].close()
            })
    
            myPeer.on('open', id => {
                socketRef.current.emit('join-room', router.query.roomId, id);
            })
    
            const connectToNewUser = (userId: any, stream: any) => {
                const call = myPeer.call(userId, stream);
                call.on('stream', userVideoStream => {
                    videoRef.current.srcObject = userVideoStream;
                })
                peers[userId] = call
            }

            return () => {
                socketRef.current.disconnect();
            }

        });
    }

    return (
        <Video ref={videoRef} autoPlay />
    )
}