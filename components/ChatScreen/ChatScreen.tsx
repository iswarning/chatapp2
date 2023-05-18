import { auth } from "@/firebase";
import { IconButton } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import Message from "../Message/Message";
import { useEffect, useRef, useState } from "react";
import getRecipientEmail from "@/utils/getRecipientEmail";
import TimeAgo from "timeago-react";
import createNewMessage from "@/services/messages/createNewMessage";
import getUserByEmail from "@/services/users/getUserByEmail";
import CallIcon from '@mui/icons-material/Call';
import { io } from "socket.io-client";
import VideoCallScreen from "../VideoCallScreen/VideoCallScreen";
import CheckIcon from '@mui/icons-material/Check';
import { BtnSend, Container, Emoji, EmojiContainer, EmojiElement, EndOfMessage, Header, HeaderIcons, HeaderInformation, Input, InputContainer, MessageContainer, StatusSendContainer, TextEmail, TextStatusSend, UserAvatar, VideoCallContainer } from "./ChatScreenStyled";
import { useRouter } from "next/router";
import Picker from "@emoji-mart/react";
import data from '@emoji-mart/data'
import popupCenter from "@/utils/popupCenter";

export default function ChatScreen({ chatId, chat, messages, onReloadMessages}: any) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const endOfMessageRef: any = useRef(null);
    const [recipientUser, setRecipientUser]: any = useState({})
    const [showEmoji, setShowEmoji] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [statusSend, setStatusSend] = useState('');
    const router = useRouter();
    const socketRef: any = useRef();
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);

    useEffect(() => {
        getRecipientUser();
        ScrollToBottom();
        socketRef.current.on("responseMessage", (msg: any) => {
            const data = JSON.parse(msg);
            if(data.recipient.includes(user?.email)) {
                onReloadMessages()
            }
          });
        return () => {
            socketRef.current.disconnect();
        };
    },[onReloadMessages])

    const getRecipientUser = async() => {
        const u = await getUserByEmail(getRecipientEmail(chat.users, user));
        if(u) {
            setRecipientUser(u.data());
        }
    }

    const checkShowAvatar = (data: any, index: number) => 
         data[index]?.data()?.user === data[index+1]?.data()?.user

    const showMessage = () => {
        return messages.map((message: any, index: number) => (
            <Message 
                key={message.id} 
                user={message.data().user} 
                message={{
                    ...message.data(), 
                    timestamp: message.data().timestamp?.toDate().getTime()
                }}
                showAvatar={checkShowAvatar(messages, index)}
            />
        ))
    }

    const ScrollToBottom = () => {
        endOfMessageRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    }

    const sendMessage = (e: any) => {
        e.preventDefault();
        setStatusSend('sending');
        createNewMessage(chatId, input, user?.email!, user?.photoURL!).then(() => {

            sendNotification();
        
            setInput('');

            if(messages.length! > 0) {
                ScrollToBottom();
            }
            
            onReloadMessages();

            setStatusSend('sent');
        }).catch((er) => console.log(er))
    }

    const sendNotification = () => {
        let listRecipientNotify = chat.users.filter((email: any) => email !== user?.email)
        let dataNofity = {
            message: input,
            recipient: chat.isGroup ? listRecipientNotify : getRecipientEmail(chat.users, user),
            name: chat.isGroup ? chat.name : user?.displayName,
        }
        socketRef.current.emit('sendMessage', JSON.stringify(dataNofity));
    }

    const handleVideoCall = () => {
        // setIsOpen(!isOpen);
        // window.open(router.basePath + "/video-call/" + chatId , "_blank", "width:200,height:500,top:0,left:40")
        popupCenter({url: router.basePath + "/video-call/" + chatId , title: '_blank', w: 400, h: 900});  
    }

    const addEmoji = (e: any) => {
        let sym = e.unified.split("-");
        let codesArray: any = [];
        sym.forEach((el: any) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);
        setInput(input + emoji);
        setShowEmoji(false);
    };

    return (
        <Container>
            <Header>
                <UserAvatar src={chat?.isGroup ? chat?.photoURL : recipientUser.photoURL} />
                <HeaderInformation>
                    <TextEmail>{chat?.isGroup ? chat.name : recipientUser.fullName}</TextEmail>
                    <p>Active {''}
                    {recipientUser?.lastSeen?.toDate() ? (
                        <TimeAgo datetime={recipientUser?.lastSeen?.toDate()} />
                    ) : (
                        "Unavailable"
                    )}
                    </p>
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton onClick={() => setIsOpen(!isOpen)}>
                        <CallIcon titleAccess="Call video"/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>
            
            <MessageContainer>
                {showMessage()}
                {
                    statusSend.length > 0 ? <StatusSendContainer>
                        <TextStatusSend>{statusSend === 'sending' ? 'Sending...' : ''}</TextStatusSend>
                        <TextStatusSend>{statusSend === 'sent' ? 'Sent ' : ''} <CheckIcon fontSize="small"/></TextStatusSend>
                    </StatusSendContainer> : null
                }
                <EndOfMessage ref={endOfMessageRef} />
            </MessageContainer>
            <InputContainer>
                {
                    showEmoji ? <EmojiContainer>
                        <Picker data={data} onEmojiSelect={addEmoji} />  
                    </EmojiContainer> : null
                }
                <IconButton onClick={() => setShowEmoji(!showEmoji)} >
                    <InsertEmoticonIcon style={{color: showEmoji ? '#0DA3BA' : ''}}/>
                </IconButton>
                <IconButton>
                    <AttachFileIcon />
                </IconButton>
                <IconButton>
                    <MicIcon />
                </IconButton>
                <Input value={input} onChange={(e) => setInput(e.target.value)}/>
                <BtnSend hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</BtnSend>
            </InputContainer>

            <VideoCallContainer isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
                <VideoCallScreen statusCall={'Calling'} photoURL={chat.isGroup ? '' : recipientUser.photoURL} recipientName={chat.isGroup ? '' : recipientUser.fullName} />
            </VideoCallContainer>
        </Container>
    )
}

