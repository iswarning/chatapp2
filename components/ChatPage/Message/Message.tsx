import { auth, db, storage } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { CustomAvatar } from "../Chat";
import styled from "styled-components";
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { lazy, useState } from "react";
import getEmojiData from "@/utils/getEmojiData";
import { useCollection } from "react-firebase-hooks/firestore";
import firebase from "firebase";
import HtmlElementWrapper from "@/modules/HTMLElementWrapper";
import { useQuery } from "@tanstack/react-query";

export default function Message({message, photoURL, chatId}: any) {

    const [userLoggedIn] = useAuthState(auth);
    const [isShown,setIsShown] = useState(false)
    const [isShownReaction,setIsShownReaction] = useState(false)
    const [load, setLoad] = useState(0)

    const formatDate = (dt: any) => {
        let d = new Date(dt);
        return d.getHours() + ":" + d.getMinutes();
    }

    const [reactionSnapshot] = useCollection(
        db
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .doc(message.id)
        .collection("reaction")
        .orderBy("timestamp")
        .limitToLast(1)
    )

    const handleReaction = async(event: any, emoji: number) => {
        event.preventDefault();
        try {
            await db
            .collection("chats")
            .doc(chatId)
            .collection("messages")
            .doc(message.id)
            .collection("reaction")
            .add({
                senderEmail: userLoggedIn?.email,
                emoji: String.fromCodePoint(emoji),
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            })
        } catch (error) {
            console.log(error)
        }
        setIsShown(false);
    }

    const [imageInMessageSnap] = useCollection(
        db
        .collection("chats")
        .doc(chatId)
        .collection("messages")
        .doc(message.id)
        .collection("imageInMessage")
    )

    const handleMessage = () => {
        let messageExport = message.message;
        if (message.type === 'text-image') {
            imageInMessageSnap?.docs?.forEach((img, index) => {
                messageExport = messageExport.replace(
                    img.data().key, 
                    `<img 
                    loading="lazy"
                    decoding="async" 
                    src="${img.data().url}" 
                    style="color: transparent;"/>`)
            })
        }
        return <div dangerouslySetInnerHTML={{__html: messageExport}} ></div>;
    }

    return (
        <>
            {
                // Sender
                message.user === userLoggedIn?.email ? <div className="message me mb-4 flex text-right">
                    <div className="flex-1 px-2">
                        <div className="inline-block p-2 px-4 text-white relative" style={{backgroundColor: '#3182ce', borderRadius: '10px'}}>
                            {/* <HtmlElementWrapper element={handleMessage(message.message)} /> */}
                            {handleMessage()}
                        </div>
                        {/* <div className="pr-4"><small className="text-gray-500">{formatDate(message.timestamp)}</small></div> */}
                    </div>
                </div>
                :
                // Reciever
                <div className="message mb-4 flex">
                    <div className="flex-2">
                        <div className="w-12 h-12 relative">
                            <CustomAvatar
                                src={photoURL}
                                width={50}
                                height={50}
                                alt="User Avatar"
                            />
                            <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
                        </div>
                    </div>
                    <div className="flex-1 px-2" onMouseEnter={() => setIsShown(true)} onMouseLeave={() => setIsShown(false)}>
                        <div className="inline-block bg-gray-300 p-2 px-4 text-gray-700 relative"  style={{backgroundColor: 'rgba(226,232,240,1)', borderRadius: '10px'}}>
                            {handleMessage()}
                            {
                                reactionSnapshot?.docs?.length! > 0 ? <ReactionContainerReciever>
                                    <div>
                                        <span key={reactionSnapshot?.docs?.[0]?.id}>
                                            {reactionSnapshot?.docs?.[0]?.data()?.emoji}
                                        </span>
                                    </div>
                                        
                                </ReactionContainerReciever> : null
                            }
                        </div>&nbsp;
                        <div className="inline-block ">
                            {
                                isShown ? <span className="text-center text-gray-400 hover:text-gray-800 cursor-pointer relative" onMouseEnter={() => setIsShownReaction(true)}>
                                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24" className="h-6 w-6"><path d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    {
                                        isShownReaction ? <div className="flex flex-row absolute px-4">
                                            {
                                                getEmojiData.map((emoji: number, index: number) => 
                                                    index < 6 ? <span key={emoji} className="cursor-pointer" onClick={(event) => handleReaction(event, emoji)}>{String.fromCodePoint(emoji)}</span> : null
                                                )
                                            }
                                        </div> : null
                                    }
                                </span> : null
                            }
                        </div>
                        
                        
                        {/* <div className="pl-4"><small className="text-gray-500">{formatDate(message.timestamp)}</small></div> */}
                    </div>
                </div>
            }                 
        </>
    )
}


const ReactionContainer = styled.div`
    border-radius: 50%;
    background-color: #fffdfd;
    color: silver;
    position: absolute;
    width: 25px;
    height: 25px;
    /* padding: 5px; */
    padding-bottom: 27px;
    text-align: center;
    align-items: center;
    /* margin-left: 30px; */
`

const ReactionContainerReciever = styled(ReactionContainer)`
    left: 0;
    /* margin-left: 30px; */
`

const ReactionContainerSender = styled(ReactionContainer)`
    right: 0;
    /* margin-left: 30px; */
`



