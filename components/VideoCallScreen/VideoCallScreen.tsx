import { useEffect, useRef, useState } from "react"
import { BtnAcceptCall, BtnContainer, BtnRejectCall, ContentCenter, Pulse, StatusCalling, UserAvatar, UserContainer, VideoCalling } from "./VideoCallScreenStyled";
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { io } from "socket.io-client";
import { useRouter } from "next/router";
import getUserByEmail from "@/services/users/getUserByEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import getRecipientEmail from "@/utils/getRecipientEmail";

export default function VideoCallScreen({ statusCall, photoURL, sender, recipient, chatId, onClose, isGroup }: any) {

    const [user] = useAuthState(auth);
    
    const router = useRouter();
    const socketRef: any = useRef();
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);

    const getUserInfo = async(email: string) => {
        const data = await getUserByEmail(email);
        if(data) {
            return data.data();
        }
        return null;
    }
    
    const handleAcceptCall = () => {
        onClose();
        window.open(router.basePath + "/video-call/" + chatId)
        let data: any = {
            sender: recipient,
            recipient: sender,
            chatId: chatId
        }
        socket.emit("accept-call-one-to-one", JSON.stringify(data))
    }

    const handleRejectCall = () => {
        
        onClose();

        if (statusCall === "Calling") {
            getUserInfo(sender).then((d) => {
                console.log(sender, recipient)
                let data: any = {
                    sender: sender,
                    recipient: recipient,
                    name: d?.fullName,
                    chatId: chatId,
                    isGroup: isGroup
                }
                socket.emit("reject-call-one-to-one", JSON.stringify(data))
            }).catch((err) => console.log(err))
        }

        if (statusCall === "Incoming Call") {
            // getUserInfo(user?.email!).then((d) => {
            //     let recipientData = [];
            //     recipientData.push(getRecipientEmail(recipient, user));
            //     recipientData.push(sender);
            //     console.log(recipientData)
            //     alert(recipientData)
            //     let data: any = {
            //         sender: user?.email,
            //         recipient: recipientData,
            //         name: d?.fullName,
            //         chatId: chatId,
            //         isGroup: isGroup
            //     }
            //     socket.emit("reject-call", JSON.stringify(data))
            // }).catch((err) => console.log(err))
            getUserInfo(user?.email!).then((d) => {
                let data: any = {
                    sender: user?.email,
                    recipient: recipient,
                    name: d?.fullName,
                    chatId: chatId,
                    isGroup: isGroup
                }
                socket.emit("reject-call-one-to-one", JSON.stringify(data))
            }).catch((err) => console.log(err))
        }

        return () => {
            socket.disconnect();
        }
        
    }

    return (
            <VideoCalling>
                <UserContainer>

                    <ContentCenter>
                        <Pulse> <UserAvatar src={photoURL}/> </Pulse>
                    </ContentCenter>                  
                    <StatusCalling>
                        {
                            statusCall
                        }
                    </StatusCalling>
                    <BtnContainer>
                        {
                            statusCall === 'Incoming Call' ? <><BtnRejectCall title="Cancel" onClick={handleRejectCall}>
                                <CallEndIcon fontSize="large"/>
                            </BtnRejectCall>
                            <BtnAcceptCall onClick={handleAcceptCall}>
                                <CallIcon fontSize="large"/>
                            </BtnAcceptCall></> : <BtnRejectCall title="Cancel" onClick={handleRejectCall}>
                                <CallEndIcon fontSize="large"/>
                            </BtnRejectCall>
                        }
                    </BtnContainer>
                </UserContainer>
            </VideoCalling>
    )
}
