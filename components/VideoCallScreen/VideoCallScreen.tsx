import { BtnAcceptCall, BtnContainer, BtnRejectCall, ContentCenter, Pulse, UserAvatar, UserContainer, VideoCalling } from "./VideoCallScreenStyled";
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { Modal } from "@mui/material";
import {useSelector,useDispatch} from 'react-redux'
import { selectAppState } from "@/redux/appSlice";
import styled from "styled-components";
import ShowVideoCallScreen from "./ShowVideoCallScreen";
import { useState } from "react";
import { StatusCallType, selectVideoCallState, setGlobalVideoCallState } from "@/redux/videoCallSlice";

export default function VideoCallScreen({open}: any) {

    const [user] = useAuthState(auth);
    const appState = useSelector(selectAppState)
    const videoCallState = useSelector(selectVideoCallState)
    const dispatch = useDispatch()
    const [stream, setStream] = useState()
    const getUserInfo = async(email: string) => {
        const data = await db.collection("users").where("email",'==',email).get()
        if(data) {
            return data.docs?.[0].data();
        }
        return null;
    }
    
    const handleAcceptCall = () => {
        dispatch(setGlobalVideoCallState({
            type: "setStatusCall",
            data: StatusCallType.CALLED
        }))
        let data: any = {
            sender: videoCallState.dataVideoCall.recipient,
            recipient: videoCallState.dataVideoCall.sender,
            chatId: videoCallState.dataVideoCall.chatId
        }
        appState.socket.emit("accept-call-one-to-one", JSON.stringify(data))
        
    }

    const handleRejectCall = () => {
        
        dispatch(setGlobalVideoCallState({
            type: "setShowVideoCallScreen",
            data: false
        }))

            if (videoCallState.statusCall === StatusCallType.CALLING) {
                getUserInfo(videoCallState.dataVideoCall.sender).then((d) => {
                    let data: any = {
                        sender: videoCallState.dataVideoCall.sender,
                        recipient: videoCallState.dataVideoCall.recipient,
                        name: d?.fullName,
                        chatId: videoCallState.dataVideoCall.chatId,
                        isGroup: videoCallState.dataVideoCall.isGroup
                    }
                    appState.socket.emit("reject-call-one-to-one", JSON.stringify(data))
                }).catch((err) => console.log(err))
            }

        if (videoCallState.statusCall === StatusCallType.INCOMING_CALL) {

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
                    recipient: videoCallState.dataVideoCall.recipient,
                    name: d?.fullName,
                    chatId: videoCallState.dataVideoCall.chatId,
                    isGroup: videoCallState.dataVideoCall.isGroup
                }
                appState.socket.emit("reject-call-one-to-one", JSON.stringify(data))
            }).catch((err) => console.log(err))
        }

        return () => {
            appState.socket.disconnect();
        }
        
    }

    return (
        <>
        <ModalContainer open={open}>
            {
                videoCallState.statusCall === StatusCallType.CALLED ? <ShowVideoCallScreen stream={stream}  /> : <VideoCalling>
                <UserContainer>

                    <ContentCenter>
                        <Pulse> <UserAvatar src={videoCallState.dataVideoCall.photoURL}/> </Pulse>
                    </ContentCenter>                  
                    <BtnContainer>
                        {
                            videoCallState.statusCall === StatusCallType.INCOMING_CALL ? <><BtnRejectCall title="Cancel" onClick={handleRejectCall}>
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
            }
            
        </ModalContainer>
        </>
            
    )
}

const ModalContainer = styled(Modal)`
    background-color: rgba(49,58,85,1);
`
