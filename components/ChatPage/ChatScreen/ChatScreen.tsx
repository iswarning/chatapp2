import { auth, db, storage } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "../Message/Message";
import { useEffect, useRef, useState } from "react";
import getRecipientEmail from "@/utils/getRecipientEmail";
import { io } from "socket.io-client";
import { useRouter } from "next/router";
import firebase from "firebase";
import styled from "styled-components";
import CallIcon from '@mui/icons-material/Call';
import VideocamIcon from '@mui/icons-material/Videocam';
import { IconButton } from "@mui/material";
import getEmojiData from "@/utils/getEmojiData";
import sendNotificationFCM from "@/utils/sendNotificationFCM";
import SendIcon from '@mui/icons-material/Send';
import Loading from "@/components/Loading";

export default function ChatScreen({ chat, messages, onShowUserDetail}: any) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState('');
    const endOfMessageRef: any = useRef(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const [listImage, setListImage] = useState<any>(null)
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();
    const [messageSnapShot] = useCollection(
        db
        .collection('chats')
        .doc(chat.id)
        .collection('messages')
        .orderBy('timestamp')
    )

    const [recipientSnapshot] = useCollection(
        db
        .collection("users")
        .where("email",'==', getRecipientEmail(chat.users, user))
    )


    useEffect(() => {
        // getRecipientUser().catch((err) => console.log(err))
        
        scrollToBottom();
        
        // socket.on('response-reject-call-one-to-one', (res: string) => {
        //     let data = JSON.parse(res);
        //     if(data.recipient === user?.email) {
        //         setIsOpen(false);
        //         // toast(`${data.name} rejected the call !`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
        //     }
        // });

        // socket.on("response-accept-call-one-to-one", (res: string) => {
        //     let data = JSON.parse(res);
        //     console.log(data.sender === user?.email)
        //     if(data.sender === user?.email) {
        //         setIsOpen(false);
        //         window.open(router.basePath + "/video-call/" + data.chatId);
        //     }
        // })

        // return () => {
        //     socket.disconnect()
        // }
    },[messageSnapShot])

    const scrollToBottom = () => {
        endOfMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }

    const getRecipientAvatar = () => {
        if(chat?.isGroup) {
            if(chat?.photoURL.length > 0)
                return chat?.photoURL
            else
                return "/images/group-default.jpg"
        } else {
            let photoUrl = recipientSnapshot?.docs?.[0].data().photoURL
            if(photoUrl?.length > 0)
                return photoUrl
            else return "/images/avatar-default.png"
        }
    }     

    const showMessage = () => {
        if(messageSnapShot) {
            return messageSnapShot?.docs?.map((message: any) => 
                <Message 
                    key={message.id}  
                    message={{
                        id: message.id,
                        ...message.data(), 
                        timestamp: message?.timestamp?.toDate().getTime()
                    }}
                    photoURL={getRecipientAvatar()}
                    chatId={chat.id}
                />)
        } else {
            return messages?.docs?.map((message: any) => 
                <Message 
                    key={message.id} 
                    message={{
                        id: message.id,
                        ...message.data(), 
                        timestamp: message?.timestamp?.toDate().getTime()
                    }}
                    photoURL={getRecipientAvatar()}
                    chatId={chat.id}
                />)
        }
    }

    const sendMessage = async(e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true)
        e.preventDefault();
        const inputMsgElement = document.getElementById("input-message");
        const listImage = inputMsgElement?.getElementsByTagName("img") ?? [];
        let sizeInput = inputMsgElement?.childNodes?.length ?? 0;

        let message = "";
        let imgString = [];
        let countImg = 0;
        for(let i = 0; i < sizeInput; i++)
        {
            switch(inputMsgElement?.childNodes[i].nodeName){
                case '#text':
                    message += inputMsgElement?.childNodes[i].nodeValue
                    break;
                case 'IMG':
                    message += `<br>#img${countImg}<br>`
                    imgString.push(`#img${countImg}`)
                    countImg++;
                    break;
                case 'BR':
                    message += '<br><br>';
                    break;
                case 'DIV':
                    let childNodeDiv: any = inputMsgElement?.childNodes[i].childNodes;
                    for(const element of childNodeDiv) {
                        switch(element.nodeName) {
                            case '#text':
                                message += element.nodeValue + '<br>';
                                break;
                            case 'IMG':
                                message += `<br>#img${countImg}<br>`;
                                imgString.push(`#img${countImg}`);
                                countImg++;
                                break;
                            case 'BR':
                                message += '<br><br>';
                                break;
                        }
                    }
                    break;
            }
        }

           

        // const newMsg: HTMLDivElement = document.createElement("div")
        // newMsg.style.border = '1px solid blue';
        // if (listImage?.length > 0) {
        //     for(let j = 0; j < imgString.length; j++) {
        //         message = message.replace("#img" + j.toString(), '<img alt="User Avatar" loading="lazy" width="130" height="130" decoding="async" data-nimg="1" class="sc-eDDNvR iaAXyW block" src="https://lh3.googleusercontent.com/a/AGNmyxaHFgmXNFi08fg5vNTjfMDxACtUTNeHL8_FwwOV3A=s96-c" style="color: transparent;"/>')
        //     }
        // }
        // newMsg.innerHTML = message;
        // document.getElementsByClassName("messages")[0].append(newMsg)

        setSeenMessage();

        const messageDoc = await db.collection('chats').doc(chat.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: message,
            user: user?.email,
            type: 'text',
            photoURL: '',
            seen: []
        });

        if(messageDoc) {
            const snap = await messageDoc.get();
            for(let o = 0; o < listImage.length; o++) {
                fetch(listImage[o].src)
                    .then(function(response) {
                        return response.blob()
                    })
                    .then(function(blob) {
                        storage.ref(`public/images/message/${snap.id}/#img${o}`).put(blob).catch(err => console.log(err))
                    }).catch(err => console.log(err));
            } 
        }
        
        sendNotification();
        const element = document.getElementById("input-message");
        if(element) element.innerHTML = "";

        scrollToBottom();

        setLoading(false)
    }

    const sendNotification = () => {
        sendNotificationFCM(
            "New message !",
            chat.isGroup ?  chat.name : user?.displayName + " : " + document.getElementById("input-message")?.innerHTML,
            recipientSnapshot?.docs?.[0]?.data().fcm_token
        ).catch(err => console.log(err))
    }

    // const handleVideoCall = async() => {
    //     let userBusy = await getUserBusy();

    //     if(!isOpen) {       

    //         if(userBusy.includes(recipientUser.email)) {

    //             toast(`${recipientUser.fullName} is busy`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
    //             return;

    //         } else {
                
    //             setIsOpen(true);
    //             // let listRecipient = chat.users.filter((email: any) => email !== user?.email);
    //             let data = {
    //                 sender: user?.email,
    //                 recipient: getRecipientEmail(chat.users, user),
    //                 chatId: chatId,
    //                 isGroup: chat.isGroup
    //             }
    //             socket.emit("call-video-one-to-one", JSON.stringify(data));
    //         }
    //     }

    //     return null;
    // }

    const addEmoji = (e: any) => {
        setInput(input + String.fromCodePoint(e));
        setShowEmoji(false);
    };

    const setSeenMessage = async() => {

        if (messageSnapShot) {
            messageSnapShot?.docs?.forEach((m) => (async() => {
                const msgRef = db
                    .collection("chats")
                    .doc(chat.id)
                    .collection("messages")
                    .doc(m.id);
                const res = await msgRef.get();
                if(res?.data()?.user === user?.email) return;
                if(res?.data()?.seen?.includes(user?.email)) return;
                let result = res?.data()?.seen;
                result.push(user?.email)
                await msgRef.set({ ...res.data(), seen: result })
            }));
        } else {
            messages?.forEach(async(m: any) => {
                const msgRef = db
                    .collection("chats")
                    .doc(chat.id)
                    .collection("messages")
                    .doc(m.id);
                const res = await msgRef.get();
                if(res?.data()?.user === user?.email) return;
                if(res?.data()?.seen?.includes(user?.email)) return;
                let result = res?.data()?.seen;
                result.push(user?.email)
                await msgRef.set({ ...res.data(), seen: result })
            });
        }
    }

    // const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    //     // event.preventDefault();
    //     // let data = event.clipboardData.items[0];
    //     // if (data.type === "image/png")
    //     // {
    //     //     let blob: any = data.getAsFile();
    
    //     //     setListImage((old: any) => [...old, blob])
    //     // }
    //     // return true;
    // }

    const uploadToBucket = (file: any, messageId: string) => {
        storage.ref(`public/images/message/${messageId}`).put(file)
    }

    return (
        // <Container>
        //     <Header>
        //         <UserAvatar src={chat?.isGroup ? chat?.photoURL : recipientUser.photoURL} />
        //         <HeaderInformation>
        //             <TextEmail>{chat?.isGroup ? 'Group: ' + chat.name : recipientUser.fullName}</TextEmail>
        //             <p>Active {''}
        //             {recipientUser?.lastSeen?.toDate() ? (
        //                 <TimeAgo datetime={recipientUser?.lastSeen?.toDate()} />
        //             ) : (
        //                 "Unavailable"
        //             )}
        //             </p>
        //         </HeaderInformation>
        //         <HeaderIcons>
        //             <IconButton onClick={handleVideoCall}>
        //                 <CallIcon titleAccess="Call video"/>
        //             </IconButton>
        //             <IconButton>
        //                 <MoreVertIcon />
        //             </IconButton>
        //         </HeaderIcons>
        //     </Header>
            
        //     <MessageContainer>
        //         {showMessage()}
        //         <EndOfMessage ref={(el) => { endOfMessageRef.current = el; }} />
        //     </MessageContainer>
        //     <InputContainer>
        //         {
        //             showEmoji ? <EmojiContainer>
        //                 {emojiData.map((e: any) => <EmojiElement onClick={() => addEmoji(e)} key={e}>
        //                     {String.fromCodePoint(e)}
        //                 </EmojiElement>)}
        //             </EmojiContainer> : null
        //         }
        //         <IconButton onClick={() => setShowEmoji(!showEmoji)} >
        //             <InsertEmoticonIcon style={{color: showEmoji ? '#0DA3BA' : ''}}/>
        //         </IconButton>
        //         <IconButton>
        //             <AttachFileIcon />
        //         </IconButton>
        //         <IconButton>
        //             <MicIcon />
        //         </IconButton>
        //         <Input value={input} onChange={(e) => setInput(e.target.value)}/>
        //         <BtnSend hidden disabled={!input} type="submit" onClick={sendMessage}>Send Message</BtnSend>
        //     </InputContainer>

        //     <VideoCallContainer isOpen={isOpen} >
        //         <VideoCallScreen statusCall='Calling' photoURL={chat.isGroup ? chat.photoURL : recipientUser.photoURL} sender={user?.email} recipient={getRecipientEmail(chat.users, user)} chatId={chatId} onClose={() => setIsOpen(false)} isGroup={chat.isGroup} />
        //     </VideoCallContainer>
        // </Container>
        <>
        <Loading isLoading={isLoading} />
        <div className="chat-area flex-1 flex flex-col relative">
            
            <div className="flex-3">
                <h2 className="text-xl pb-1 mb-4 border-b-2 border-gray-200 d-flex">
                    {chat.isGroup ? 'Chatting in group ' : 'Chatting with '}&nbsp;
                    {
                        !chat.isGroup ? <div onClick={() => router.push(`/profile?id=${recipientSnapshot?.docs?.[0].id}`)} className="cursor-pointer font-semibold" id="hover-animation" data-replace="Profile">
                            <span>{recipientSnapshot?.docs?.[0].data().fullName}</span>
                        </div> : <span>{chat.name}</span>
                    }
                    <div className="ml-auto">
                        <IconButton>
                            <VideocamIcon  fontSize="small" />
                        </IconButton>
                        <IconButton>
                            <CallIcon fontSize="small" />
                        </IconButton>
                    </div>
                </h2>
            </div>
            <div className="messages flex-1 overflow-auto h-screen px-4">
                {showMessage()}
                <EndOfMessage ref={(el) => { endOfMessageRef.current = el; }} />
            </div>
            
            <div className="flex-2 pt-4 pb-10">
                <div className="write bg-white shadow flex rounded-lg">
                    <div className="flex-3 flex content-center items-center text-center p-4 pr-0">
                        <span className="block text-center text-gray-400 hover:text-gray-800" onClick={() => setShowEmoji(!showEmoji)}>
                            <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="h-6 w-6"><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </span>
                    </div>
                    <div className="flex-1">
                            <InputMessage
                            contentEditable="true"
                            className="w-full block outline-none py-4 px-4 bg-transparent"
                            style={{maxHeight: '80px'}} 
                            onClick={setSeenMessage} 
                            id="input-message" 
                            placeholder="Type message..." />
                    </div>
                    
                    <div className="flex-2 w-32 p-2 flex content-center items-center">
                        <div className="flex-1 text-center" onClick={() => sendMessage}>
                            <span className="text-gray-400 hover:text-gray-800">
                                <span className="inline-block align-text-bottom" >
                                    <svg fill="none" strokeLinecap="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
                                </span>
                            </span>
                        </div>
                        <div className="flex-1 text-center cursor-pointer" >
                            <span className="text-gray-400 hover:text-gray-800" onClick={(e) => sendMessage(e)}>
                                <span className="inline-block align-text-bottom">
                                    <SendIcon />
                                </span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {
                showEmoji ? <EmojiContainer>
                    {getEmojiData.map((e: any) => <EmojiElement onClick={() => addEmoji(e)} key={e}>
                        {String.fromCodePoint(e)}
                    </EmojiElement>)}
                </EmojiContainer> : null
            }
        </div>
        </>
    )
}



const InputMessage = styled.div`
    background-color: white;
    outline: #ccc;
    border-radius: 10px;
    padding: 20px;
    overflow: hidden;
    max-height: 200px;
    overflow-y: scroll;
    border: none;
    background-position: center;
    object-fit: cover;
    background-repeat: no-repeat;
`

const EmojiContainer = styled.div.attrs(() => ({
    className: ''
}))`
    position: absolute;
    width: max-content;
    max-width: 400px;
    background-color: white;
    border-radius: 10px;
    padding: 10px;
    margin-top: 35%;
    overflow: scroll;
    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
    display: flex;
    flex-wrap: wrap;
    max-height: 300px;
`

const EmojiElement = styled.div.attrs(() => ({
    className: ''
}))`
    width: 25%;
    cursor: pointer;
    font-size: 50px;
    padding-left: 10px;
    :hover {
        border-radius: 10px;
        background-color: #ddebeb;
    }
`

const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;