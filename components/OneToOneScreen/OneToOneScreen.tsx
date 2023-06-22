import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase';
import { toast } from 'react-toastify';
import { selectAppState } from '@/redux/appSlice';
import {useSelector} from 'react-redux';
import Peer from 'peerjs';
export default function OneToOneScreen({chatRoomId}: {chatRoomId: string}) {
    
    const videoRef: any = useRef(null);
    const router = useRouter();
    const appState = useSelector(selectAppState)

    const [user] = useAuthState(auth);

    useEffect(() => {
        // getVideoStream()
    },[])

    function getVideoStream() {
        import('peerjs').then(({ default: Peer }) => {
            
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

            appState.socket.on('user-connected', (response: any) => {
                let data = JSON.parse(response);
                connectToNewUser(data.clientId, stream);
            })

        }).catch((err) => console.log(err))

        appState.socket.on('user-disconnected', (response: any) => {
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
                //     socket.emit("disconnect-call", JSON.stringify(dataSend))
                //     peers[dataRes.clientId].close();
                // }).catch((err) => console.log(err));
                peers[dataRes.clientId].close();
            }
        })

        myPeer.on('open', id => {
            let data = {
                clientId: id,
                chatRoomId: appState.dataVideoCall.chatId,
                sender: user?.email,
                name: user?.displayName
            }
            appState.socket.emit('join-room', JSON.stringify(data));
        })

        const connectToNewUser = (userId: any, stream: any) => {
            const call = myPeer.call(userId, stream);
            call.on('stream', userVideoStream => {
                videoRef.current.srcObject = userVideoStream;
            })
            peers[userId] = call
        }

        return () => {
            appState.socket.disconnect();
        }

    }).catch((err) => console.log(err));
    }    

    return (
        <>
            <VideoContainer>
                {/* <Video ref={videoRef} autoPlay /> */}
                <Video src='https://www.w3schools.com/tags/movie.mp4' />
            </VideoContainer>
        </>    
    )
}

const VideoContainer = styled.div`
    
`

export const Video = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
`;