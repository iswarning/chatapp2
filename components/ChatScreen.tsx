import { auth, db } from "@/firebase";
import { IconButton, Avatar } from "@mui/material";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import MicIcon from '@mui/icons-material/Mic';
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import { useEffect, useRef, useState } from "react";
import getRecipientEmail from "@/utils/getRecipientEmail";
import TimeAgo from "timeago-react";
import getMessagesByChatId from "@/services/messages/getMessagesByChatId";
import createNewMessage from "@/services/messages/createNewMessage";
import getUserByEmail from "@/services/users/getUserByEmail";
import CallIcon from '@mui/icons-material/Call';
import firebase from "firebase";
import { io } from "socket.io-client";

export default function ChatScreen({ chatId, chat, messages, onSend}: any) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const endOfMessageRef: any = useRef(null);
    const [messageData, setMessageData]: any = useState([])
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

    const sendMessage = async(e: any) => {
        e.preventDefault();

        await createNewMessage(chatId, input, user?.email!, user?.photoURL!);
        
        sendNotification();
        
        setInput('');

        if(messageData.length! > 0) {
            ScrollToBottom();
        }
        
        onSend()
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
                    <IconButton>
                        <CallIcon titleAccess="Call video"/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </HeaderIcons>
            </Header>
            
            <MessageContainer>
                {showMessage()}
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
                <button hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</button>
            </InputContainer>
        </Container>
    )
}

const EmojiContainer = styled.div.attrs(() => ({
    className: ''
}))`
    position: absolute;
    width: 250px;
    /* max-width: 250px; */
    height: 150px;
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 250px;
    margin-left: 5px;
    overflow: scroll;
    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
    display: flex;
    flex-wrap: wrap;
`

const EmojiElement = styled.div.attrs(() => ({
    className: ''
}))`
    width: 25%;
    cursor: pointer;
    :hover {
        border-radius: 10px;
        background-color: #ddebeb;
    }
`

const Emoji = styled.div`
    font-size: 40px;
`

const UserAvatar = styled(Avatar)`
    width: 50px;
    height: 50px;
`

const Container = styled.div`
    font-size: 18px;
`;

const TextEmail = styled.label`
    margin-top: 10px;
    font-weight: 500;
`; 

const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
`;

const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: fixed;
    bottom: 0;
    background-color: white;
    z-index: 100;
    width: 100%;
`;

const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;
const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 3px;
    }

    > p {
        font-size: 14px;
        color: gray;
    }
`;
const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;
const HeaderIcons = styled.div``;
const MessageContainer = styled.div`
    padding: 20px 10px 40px 30px;
    background-color: #ddebeb;
    min-height: 90vh;
    
`;