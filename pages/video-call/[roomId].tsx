import { Video, VideoGrid } from "@/components/VideoCallScreen/VideoCallScreenStyled";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function VideoCall() {

    const router = useRouter();

    import('peerjs').then(({ default: Peer }) => {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
        const videoGrid = document.getElementById('video-grid');
        const peers: any = {};
        const myPeer = new Peer(undefined!, {
            host: '/',
            path: '/peerjs',
            port: 443
        });
        const myVideo = document.createElement('video');
        myVideo.style.width = '100%';
        myVideo.style.height = '100%';
        myVideo.style.objectFit = 'cover';
        myVideo.muted = true;

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
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

            // socket.on('user-connected', userId => {
            //     connectToNewUser(userId, stream);
            // })
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
    });

    return (
        <VideoGrid id='video-grid'>
        </VideoGrid>
    )
    
}