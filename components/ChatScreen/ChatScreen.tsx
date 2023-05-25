import { auth, db } from "@/firebase";
import { IconButton } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
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
import { toast } from "react-toastify";
import getUserBusy from "@/utils/getUserBusy";
import firebase from "firebase";

let emojiData: any = [
    0x1F600,
    0x1F604,
    0x1F605,
    0x1F606,
    0x1F923,
    0x1F602,
    0x1F642,
    0x1F970,
    0x1F618,
    0x1F60D,
    0x1F60B,
    0x1F917,
    0x1F644,
    0x1F611,
    0x1F60C,
    0x1F634,
    0x1F62A,
]

export default function ChatScreen({ chatId, chat, messages, onReloadMessages}: any) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const endOfMessageRef: any = useRef(null);
    const [recipientUser, setRecipientUser]: any = useState({})
    const [showEmoji, setShowEmoji] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const [newMess, setNewMess]: any = useState([]);
    const [snapShot] = useCollection(
        db
        .collection('chats')
        .doc(chatId)
        .collection('messages')
        .orderBy('timestamp')
    )

    const socketRef: any = useRef();
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);

    useEffect(() => {
        getRecipientUser().catch((err) => console.log(err))
        // ScrollToBottom();
        endOfMessageRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });

        socketRef.current.on("response-message", (msg: any) => {
            const data = JSON.parse(msg);
            if(data.recipient.includes(user?.email)) {
                onReloadMessages()
            }
        });
        
        socketRef.current.on('response-reject-call', (res: string) => {
            let data = JSON.parse(res);
            if(data.recipient.includes(user?.email)) {
                if (!data.isGroup) {
                    setIsOpen(false);
                } else {
                    getUserBusy().then((d) => {
                        if(d.length === 1) {
                            setIsOpen(false);
                        }
                    }).catch((err) => console.log(err))
                }
            }
        });

        socketRef.current.on("response-accept-call", (res: string) => {
            let data = JSON.parse(res);
            if(data.recipient.includes(user?.email)) {
                setIsOpen(false);
                window.open(router.basePath + "/video-call/" + data.chatId)
            }
        })

        return () => {
            socketRef.current.disconnect()
        }
    },[])

    const getRecipientUser = async() => {
        const u = await getUserByEmail(getRecipientEmail(chat.users, user));
        if(u) {
            setRecipientUser({
                id: u.id,
                ...u.data()
            });
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
                showAvatar={ newMess.length > 0 ? checkShowAvatar(messages, index) : false}
            />
        ))
    }

    // const ScrollToBottom = () => {
        
    // }

    const sendMessage = async(e: any) => {
        e.preventDefault();

        db.collection('chats').doc(chatId).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            user: user?.email,
            type: 'text',
            photoURL: ''
        }).catch((err) => console.log(err))
        
        sendNotification();
        
        setInput('');

        // ScrollToBottom();
    }

    const sendNotification = () => {
        socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
        let listRecipient = chat.users.filter((email: any) => email !== user?.email)
        let dataNofity = {
            message: input,
            recipient: chat.isGroup ? listRecipient : getRecipientEmail(chat.users, user),
            name: chat.isGroup ? chat.name : user?.displayName,
            isGroup: chat.isGroup,
        }
        socketRef.current.emit('send-message', JSON.stringify(dataNofity));
    }

    const handleVideoCall = async() => {
        let userBusy = await getUserBusy();

        if(!isOpen) {       

            if(userBusy.includes(recipientUser.email)) {

                toast(`${recipientUser.fullName} is busy`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
                return;

            } else {
                socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
                setIsOpen(true);
                let listRecipient = chat.users.filter((email: any) => email !== user?.email);
                let data = {
                    sender: user?.email,
                    recipient: chat.isGroup ? listRecipient : getRecipientEmail(chat.users, user),
                    chatId: chatId,
                    isGroup: chat.isGroup
                }
                socketRef.current.emit("call-video", JSON.stringify(data));
            }
        }

        return null;
    }

    const addEmoji = (e: any) => {
        setInput(input + String.fromCodePoint(e));
        setShowEmoji(false);
    };

    return (
        <Container>
            <Header>
                <UserAvatar src={chat?.isGroup ? chat?.photoURL : recipientUser.photoURL} />
                <HeaderInformation>
                    <TextEmail>{chat?.isGroup ? 'Team: ' + chat.name : recipientUser.fullName}</TextEmail>
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
                {/* {showMessage()} */}
                {
                    snapShot?.docs?.length! > 0 ? snapShot?.docs.map((message, index) => 
                        <Message 
                            key={message.id} 
                            user={message.data().user} 
                            message={{
                                ...message.data(), 
                                timestamp: message.data().timestamp?.toDate().getTime()
                            }}
                            showAvatar={checkShowAvatar(snapShot?.docs, index)}
                        />
                    ) : null
                }
                {/* {
                    messages.length > 0 ? messages.map((message: any, index: number) => 
                        <Message 
                            key={message.id} 
                            user={message.data().user} 
                            message={{
                                ...message.data(), 
                                timestamp: message.data().timestamp?.toDate().getTime()
                            }}
                            showAvatar={checkShowAvatar(messages, index)}
                        />
                    ) : null
                } */}
                {
                    newMess.length > 0 ? newMess.map((message: any, index: number) => 
                        <Message 
                            key={message.id} 
                            user={message.data().user} 
                            message={{
                                ...message.data(), 
                                timestamp: message.data().timestamp?.toDate().getTime()
                            }}
                            showAvatar={checkShowAvatar(newMess, index)}
                        />
                    ) : null
                }
                <EndOfMessage ref={endOfMessageRef} />
            </MessageContainer>
            <InputContainer>
                {
                    showEmoji ? <EmojiContainer>
                        {emojiData.map((e: any) => <EmojiElement onClick={() => addEmoji(e)} key={e}>
                            {String.fromCodePoint(e)}
                        </EmojiElement>)}
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

            <VideoCallContainer isOpen={isOpen} >
                <VideoCallScreen statusCall='Calling' photoURL={chat.isGroup ? chat.photoURL : recipientUser.photoURL} sender={user?.email} recipient={chat.users.filter((email: any) => email !== user?.email)} chatId={chatId} onClose={() => setIsOpen(false)} isGroup={chat.isGroup} />
            </VideoCallContainer>
        </Container>
    )
}

