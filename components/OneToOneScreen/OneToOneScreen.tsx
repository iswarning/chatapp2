import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Video } from '../VideoCallScreen/VideoCallScreenStyled';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import getChatById from '@/services/chats/getChatById';
import { toast } from 'react-toastify';
export default function OneToOneScreen() {

    const socketRef: any = useRef();
    
    const videoRef: any = useRef(null);
    const router = useRouter();

    const [user] = useAuthState(auth);

    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!)

    useEffect(() => {
        getVideoStream();
        // socketRef.current.on("response-disconnect-call", (data: any) => {
        //     let response = JSON.parse(data);
        //     toast(`${response.name} disconnected the call`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
        // })
        // return () => {
        //     socketRef.current.disconnect();
        // }
    },[])

    const getVideoStream = () => {
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
    
                socketRef.current.on('user-connected', (response: any) => {
                    let data = JSON.parse(response);
                    connectToNewUser(data.clientId, stream);
                })

            }).catch((err) => console.log(err))
    
            socketRef.current.on('user-disconnected', (response: any) => {
                let dataRes: any = JSON.parse(response);
                if(peers[dataRes.clientId]) { 
                    // getChatById(dataRes.chatRoomId).then((chat) => {
                    //     let dataSend: any = {
                    //         sender: dataRes.sender,
                    //         name: dataRes.name,
                    //         chatId: dataRes.chatRoomId,
                    //         recipient: chat?.data()?.users.filter((user: any) => user === user?.email),
                    //         isGroup: false
                    //     }
                    //     socketRef.current.emit("disconnect-call", JSON.stringify(dataSend))
                    //     peers[dataRes.clientId].close();
                    // }).catch((err) => console.log(err));
                    peers[dataRes.clientId].close();
                }
            })
    
            myPeer.on('open', id => {
                let data = {
                    clientId: id,
                    chatRoomId: router.query.roomId,
                    sender: user?.email,
                    name: user?.displayName
                }
                socketRef.current.emit('join-room', JSON.stringify(data));
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

        }).catch((err) => console.log(err));
    }

    return (
        <>
            <VideoContainer>
                <Video ref={videoRef} autoPlay />
            </VideoContainer>
        </>    
    )
}

const VideoContainer = styled.div`
    text-align: center;
`