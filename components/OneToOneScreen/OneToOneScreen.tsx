import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase';
import { toast } from 'react-toastify';
import { selectAppState } from '@/redux/appSlice';
import {useSelector,useDispatch} from 'react-redux';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import MicIcon from '@mui/icons-material/Mic';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Peer from 'peerjs';


export default function OneToOneScreen({ chatRoomId, showCam, showMic, disconnectCall }: { chatRoomId: string,showCam: boolean, showMic: boolean, disconnectCall: any }) {
    
    const remoteVideoRef: any = useRef(null);
    const appState = useSelector(selectAppState)
    const [user] = useAuthState(auth);
    const localVideoRef: any = useRef(null)
    const [userCam, setUserCam] = useState(false)
    const [userMic, setUserMic] = useState(false)

    import('peerjs').then(({ default: Peer }) => {
            
        const peers: any = {};
        const myPeer = new Peer();

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((stream) => {
            myPeer.on('call', call => {

                stream.getVideoTracks()[0].enabled = showCam
    
                call.answer(stream)    
                
                call.on('stream', userVideoStream => {
                    remoteVideoRef.current.srcObject = userVideoStream;
                })
            })
    
            appState.socket.on('user-connected', (response: any) => {
                let data = JSON.parse(response);
                connectToNewUser(data.clientId, stream);
            })
        })
        
        appState.socket.on('user-disconnected', (response: any) => {
            let dataRes: any = JSON.parse(response);
            if(peers[dataRes.clientId]) { 
                
                db.collection("chats").doc(dataRes.chatRoomId).get().then((chat) => {
                    let dataSend: any = {
                        sender: dataRes.sender,
                        name: dataRes.name,
                        chatId: dataRes.chatRoomId,
                        recipient: chat?.data()?.users.filter((user: any) => user === user?.email),
                        isGroup: false
                    }
                    appState.socket.emit("disconnect-call", JSON.stringify(dataSend))
                    peers[dataRes.clientId].close();
                }).catch((err) => console.log(err));
                peers[dataRes.clientId].close();
                disconnectCall()
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
                remoteVideoRef.current.srcObject = userVideoStream;
            })
            peers[userId] = call
        }

        return () => {
            appState.socket.disconnect();
        }

    }).catch((err) => console.log(err)); 

    return (
        <>
            <VideoContainer>
                <Video ref={remoteVideoRef} autoPlay />
                {
                    <MyVideo ref={localVideoRef} muted autoPlay />
                }
                <ActionContainer className='flex'>
                    {
                        userMic ? <MicIcon fontSize="large" className='cursor-pointer' /> : <MicOffIcon fontSize="large" className='cursor-pointer' />
                    }
                    {
                        userCam ? <VideocamIcon fontSize="large" className='cursor-pointer' /> : <VideocamOffIcon fontSize="large" className='cursor-pointer' />
                    }
                </ActionContainer>
            </VideoContainer>
        </>    
    )
}

const ActionContainer = styled.div`
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px;
`

const VideoContainer = styled.div`
    position: relative;
`

export const Video = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
`;

const MyVideo = styled.video`
    width: 30%;
    height: 30%;
    object-fit: cover;
    border-radius: 10px;
    position: absolute;
    margin-top: -22%;
`

const MyAvatar = styled(Image)`
    width: 30%;
    height: 30%;
    object-fit: cover;
    border-radius: 10px;
    position: absolute;
    margin-top: -22%;
`