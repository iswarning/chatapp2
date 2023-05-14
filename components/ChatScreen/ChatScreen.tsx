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

export default function ChatScreen({ chatId, chat, messages, onSend}: any) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const endOfMessageRef: any = useRef(null);
    const [recipientUser, setRecipientUser]: any = useState({})
    const [showEmoji, setShowEmoji] = useState(false);
    const emojiData = [
        '&#128513;',
        '&#128514;',
        '&#128515;',
        '&#128516;',
        '&#128517;',
        '&#128544;',
    ];
    const [isOpen, setIsOpen] = useState(false);
    const [statusSend, setStatusSend] = useState('');

    useEffect(() => {
        getRecipientUser();
        ScrollToBottom();
    },[onSend])

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
            
            onSend();

            setStatusSend('sent');
        }).catch((er) => console.log(er))
        
    }

    const sendNotification = () => {
        const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
        let listRecipientNotify = chat.users.filter((email: any) => email !== user?.email)
        let dataNofity = {
            message: input,
            recipient: chat.isGroup ? listRecipientNotify : getRecipientEmail(chat.users, user),
            name: chat.isGroup ? chat.name : user?.displayName
        }
        socket.emit('chat message', JSON.stringify(dataNofity));
    }

    const setEmojiToInput = (e: string) => {
        setInput(input + e);
        setShowEmoji(false);
    }

    const handleVideoCall = () => {
        setIsOpen(!isOpen)
    }

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
                    <IconButton onClick={handleVideoCall}>
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
                        {emojiData.length > 0 ? emojiData.map((e) => 
                            <EmojiElement key={e} onClick={() => setEmojiToInput(e)}>
                                <Emoji dangerouslySetInnerHTML={{__html: e}} />
                            </EmojiElement>
                        )    
                        : null}
                    </EmojiContainer> : null
                }
                <IconButton onClick={() => setShowEmoji(!showEmoji)}>
                    <InsertEmoticonIcon />
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
                <VideoCallScreen />
            </VideoCallContainer>
            
        </Container>
    )
}

