import { BtnAcceptCall, BtnContainer, BtnRejectCall, ContentCenter, Pulse, StatusCalling, UserAvatar, UserContainer, VideoCalling } from "./VideoCallScreenStyled";
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { Modal } from "@mui/material";
import {useSelector,useDispatch} from 'react-redux'
import { StatusCallType, selectAppState, setAcceptedCall, setShowVideoCallScreen } from "@/redux/appSlice";
import styled from "styled-components";
import ShowVideoCallScreen from "./ShowVideoCallScreen";

export default function VideoCallScreen({open}: any) {

    const [user] = useAuthState(auth);
    const appState = useSelector(selectAppState)
    const dispatch = useDispatch()

    const getUserInfo = async(email: string) => {
        const data = await db.collection("users").where("email",'==',email).get()
        if(data) {
            return data.docs?.[0].data();
        }
        return null;
    }
    
    const handleAcceptCall = () => {
        dispatch(setAcceptedCall(true))
        let data: any = {
            sender: appState.dataVideoCall.recipient,
            recipient: appState.dataVideoCall.sender,
            chatId: appState.dataVideoCall.chatId
        }
        appState.socket.emit("accept-call-one-to-one", JSON.stringify(data))
    }

    const handleRejectCall = () => {
        
        dispatch(setShowVideoCallScreen(false))

            if (appState.statusCall === StatusCallType.CALLING) {
                getUserInfo(appState.dataVideoCall.sender).then((d) => {
                    let data: any = {
                        sender: appState.dataVideoCall.sender,
                        recipient: appState.dataVideoCall.recipient,
                        name: d?.fullName,
                        chatId: appState.dataVideoCall.chatId,
                        isGroup: appState.dataVideoCall.isGroup
                    }
                    appState.socket.emit("reject-call-one-to-one", JSON.stringify(data))
                }).catch((err) => console.log(err))
            }

        if (appState.statusCall === StatusCallType.INCOMING_CALL) {

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
                    recipient: appState.dataVideoCall.recipient,
                    name: d?.fullName,
                    chatId: appState.dataVideoCall.chatId,
                    isGroup: appState.dataVideoCall.isGroup
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
                appState.acceptedCall ? <ShowVideoCallScreen  /> : <VideoCalling>
                <UserContainer>

                    <ContentCenter>
                        <Pulse> <UserAvatar src={appState.dataVideoCall.photoURL}/> </Pulse>
                    </ContentCenter>                  
                    <BtnContainer>
                        {
                            appState.statusCall === StatusCallType.INCOMING_CALL ? <><BtnRejectCall title="Cancel" onClick={handleRejectCall}>
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
