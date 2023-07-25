import styled, { keyframes } from "styled-components";
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import CallEndIcon from '@mui/icons-material/CallEnd';
import { Modal } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux'
import { StatusCallType, selectVideoCallState, setGlobalVideoCallState } from "@/redux/videoCallSlice";
import { selectAppState } from "@/redux/appSlice";
import { setDataVideoCall } from "@/services/CacheService";
import { videoCall } from "@/services/ChatRoomService";
import { selectChatState } from "@/redux/chatSlice";
import { generateRtcToken } from "@/services/UserService";

export default function PopupVideoCall({ show }: { show: boolean }) {

    const dispatch = useDispatch()
    const videoCallState = useSelector(selectVideoCallState)
    const appState = useSelector(selectAppState)
    const chatState = useSelector(selectChatState)
    const chat = chatState.listChat.find((c) => c._id === videoCallState.notifyResponse.dataVideoCall?.chatRoomId)

    const handleReject = () => {
        dispatch(setGlobalVideoCallState({
            type: "setShowVideoCallScreen",
            data: false
        }))
        dispatch(setGlobalVideoCallState({
            type: "setStatusCall",
            data: StatusCallType.DISCONNECT_CALL
        }));
    }

    const handleAccept = async() => {
        dispatch(setGlobalVideoCallState({
            type: "setShowVideoCallScreen",
            data: false
        }))
        dispatch(setGlobalVideoCallState({
            type: "setStatusCall",
            data: StatusCallType.CALLED
        }));
        const accessToken = await generateRtcToken({chatRoomId: chat?._id!})
        let data = {
            type: "accept-call",
            senderId: appState.userInfo._id!,
            recipientId: chat?.isGroup ? JSON.stringify(chat?.listRecipientInfo?.map((re) => re._id))  : chat?.recipientInfo?._id!,
            dataVideoCall: {
              chatRoomId: chat?._id,
              isGroup: chat?.isGroup,
              accessToken
            }
        }
        setDataVideoCall(data, dispatch)
        videoCall({
          type: "accept-call",
          senderId: appState.userInfo._id!,
          recipientId: chat?.isGroup ? JSON.stringify(chat?.listRecipientInfo?.map((re) => re._id))  : chat?.recipientInfo?._id!,
          chatRoomId: chat?._id,
          isGroup: chat?.isGroup,
          accessToken
        })
    }

  return (
    <ModalContainer open={show}>
      <div >
          <Pulse>
              <img 
              src={videoCallState.notifyResponse.dataVideoCall?.photoURL}
              alt="" 
              className="rounded-full"/>
          </Pulse>
          
          <ActionContainer>
              <AcceptBtn onClick={handleAccept}>
                  <LocalPhoneIcon fontSize="large" />
              </AcceptBtn>
              <RejectBtn onClick={handleReject}>
                  <CallEndIcon fontSize="large" />
              </RejectBtn>
          </ActionContainer>
      </div>
  </ModalContainer>
  )
  
}

const pulse = keyframes`
    0% {
        transform: scale(0.5);
        opacity: 0
    }

    50% {
        transform: scale(1);
        opacity: 1
    }

    100% {
        transform: scale(1.3);
        opacity: 0
    }
`

const Pulse = styled.div`
    height: 100px;
    width: 100px;
    margin-top: 100px;
    margin-left: auto;
    margin-right: auto;
    background-color: orange;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &:before {
        content: "";
        position: absolute;
        border: 1px solid yellow;
        width: calc(100% + 40px);
        height: calc(100% + 40px);
        border-radius: 50%;
        animation: ${pulse} 1s linear infinite
    }

    &:after {
        content: "";
        position: absolute;
        border: 1px solid yellow;
        width: calc(100% + 40px);
        height: calc(100% + 40px);
        border-radius: 50%;
        animation: ${pulse} 1s linear infinite;
        animation-delay: 0.3s
    }

`;

const ActionContainer = styled.div`
    margin-top: 80px;
    text-align: center;
`

const RejectBtn = styled.button`
    margin-left: 50px;
    background-color: red;
    color: white;
    border-radius: 50%;
    padding: 10px;
`

const AcceptBtn = styled.button`
    background-color: #6bdd6b;
    color: white;
    border-radius: 50%;
    padding: 10px;
`

const ModalContainer = styled(Modal)`
    width: 500px;
    height: 500px;
    background: white;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10%;
    border-radius: 10px;
    padding: 30px;
`
