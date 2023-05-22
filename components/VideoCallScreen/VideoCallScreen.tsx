import { useEffect, useRef, useState } from "react"
import { BtnAcceptCall, BtnContainer, BtnRejectCall, ContentCenter, Pulse, StatusCalling, UserAvatar, UserContainer, VideoCalling } from "./VideoCallScreenStyled";
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { io } from "socket.io-client";
import getUserById from "@/services/users/getUserById";
import popupCenter from "@/utils/popupCenter";
import { useRouter } from "next/router";
import getUserByEmail from "@/services/users/getUserByEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import getRecipientEmail from "@/utils/getRecipientEmail";
import getUserBusy from "@/utils/getUserBusy";

export default function VideoCallScreen({ statusCall, photoURL, sender, recipient, chatId, onClose, isGroup }: any) {

    const [statusVideo, setStatusVideo] = useState(statusCall);
    const [user] = useAuthState(auth);
    const [showCam, setShowCam] = useState(false);
    const [showMic, setShowMic] = useState(true);
    const [second, setSecond] = useState(0);
    const [minute, setMinute] = useState(0);
    const router = useRouter();
    const socketRef: any = useRef();
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);

    useInterval(() => {
        setSecond(second + 1);
        if(second == 59) {
            setSecond(0);
            setMinute((oldMinute) => oldMinute + 1)
        }
    }, 1000);

    const getUserInfo = async(email: string) => {
        const data = await getUserByEmail(email);
        if(data) {
            return data.data();
        }
        return null;
    }

    function formatNumber(num: number){
        if(num.toString().length === 1) 
            return '0' + num;
        return num;
    }

    function useInterval(callback: any, delay: any) {
        const savedCallback: any = useRef();
      
        // Remember the latest callback.
        useEffect(() => {
          savedCallback.current = callback;
        }, [callback]);
      
        // Set up the interval.
        useEffect(() => {
          let id = setInterval(() => {
            savedCallback.current();
          }, delay);
          return () => clearInterval(id);
        }, [delay]);
    }
    

    const handleAcceptCall = () => {
        // if(navigator.mediaDevices.getUserMedia) {

        // }
        setStatusVideo('Called');
        setSecond(0);
        window.open(router.basePath + "/video-call/" + chatId)
        let data: any = {
            sender: recipient,
            recipient: sender,
            chatId: chatId
        }
        socketRef.current.emit("accept-call", JSON.stringify(data))
    }

    const handleRejectCall = () => {

        onClose();

        if (statusVideo === "Calling") {
            getUserInfo(sender).then((d) => {
                let data: any = {
                    sender: sender,
                    recipient: recipient,
                    name: d?.fullName,
                    chatId: chatId,
                    isGroup: isGroup
                }
                socketRef.current.emit("reject-call", JSON.stringify(data))
            })
        }

        if (statusVideo === "Incoming Call") {
            getUserInfo(user?.email!).then((d) => {
                let recipientData = [];
                recipientData.push(getRecipientEmail(recipient, user));
                recipientData.push(sender);
                let data: any = {
                    sender: user?.email,
                    recipient: recipientData,
                    name: d?.fullName,
                    chatId: chatId,
                    isGroup: isGroup
                }
                socketRef.current.emit("reject-call", JSON.stringify(data))
            })
        }

        if(statusVideo === "Called") {
            getUserInfo(user?.email!).then((d) => {
                let data: any = {
                    sender: user?.email,
                    recipient: sender,
                    name: d?.fullName,
                }
                socketRef.current.emit("reject-call", JSON.stringify(data))
            })
        }

        return () => {
            socketRef.current.disconnect();
        }
        
    }

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
                    <StatusCalling>
                        {
                            statusVideo === 'Called' ? formatNumber(minute) + ':' + formatNumber(second) : statusVideo
                        }
                    </StatusCalling>
                    <BtnContainer>
                        {
                            statusVideo === 'Incoming Call' ? <><BtnRejectCall title="Cancel" onClick={handleRejectCall}>
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