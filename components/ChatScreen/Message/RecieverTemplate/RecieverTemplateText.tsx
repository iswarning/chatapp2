import { MessageType } from "@/types/MessageType";
import { getEmojiIcon } from "@/utils/getEmojiData";
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { ChatType } from "@/types/ChatType";
import Image from "next/image";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import ReplyIcon from '@mui/icons-material/Reply';
import { useState } from "react";
import styled from "styled-components";


export default function RecieverTemplateText({ 
    showAvatar, 
    chat, 
    message, 
    timestamp, 
    lastIndex, 
    handleReaction 
} : { 
    showAvatar: boolean, 
    chat: ChatType, 
    message: MessageType, 
    timestamp: any, 
    lastIndex: boolean,
    handleReaction: any }) {

    const [showAction, setShowAction] = useState(false)
    const [showEmoji, setShowEmoji] = useState(false)

    const handleMessage = () => {
        let messageExport: string = message.message!;
        return <div 
            dangerouslySetInnerHTML={{ __html: messageExport }} 
            style={{fontSize: message.type === 'text' && getEmojiIcon.includes(message.message!) && message.message!.length === 2 ? '50px' : '' }}>
            </div>;
    }

    return (
        <>
            <div className="chat-text-box flex items-end float-left mb-4" title={timestamp}>
                {
                    chat.isGroup && showAvatar ? <div className="chat-text-box__photo w-10 h-10 hidden sm:block flex-none image-fit relative mr-4">
                        <Image
                        src={chat.listRecipientInfo?.find((info) => info._id === message.senderId)?.photoURL!}
                        width={64}
                        height={64}
                        alt=""
                        className="rounded-full mt-6"
                        />
                    </div> : <div className="chat-text-box__photo w-10 h-10 hidden sm:block flex-none image-fit relative mr-4"></div>
                }
                <div className="w-full">
                    <div>
                        <div
                        className="chat-text-box__content flex items-center float-left" 
                        title={timestamp}           
                        onMouseEnter={() => setShowAction(true)}
                        onMouseLeave={() => {setShowAction(false); setShowEmoji(false)}}>
                            <div className="box leading-relaxed dark:text-gray-300 text-gray-700 px-4 py-3 mt-3">
                                {handleMessage()}
                                {
                                    message.reaction?.length! > 0 ? JSON.parse(message.reaction!).map((react: any) => 
                                        <EmojiExist>{react.emoji}</EmojiExist>
                                    ) : null
                                }
                            </div>
                            {
                                showAction ? <div className="hidden sm:block dropdown relative ml-3 mt-3">
                                    <InsertEmoticonIcon 
                                    fontSize='small' 
                                    className="cursor-pointer"
                                    onMouseEnter={() => setShowEmoji(true)}  />
                                    <ReplyIcon fontSize='small'/>
                                    {
                                        showEmoji ? <EmojiContainer>
                                            { getEmojiIcon.map((emo, i) => 
                                                i < 7 ? <div onClick={(event) => handleReaction(event, emo)} className="cursor-pointer" key={emo}>{emo}</div> : null
                                            )}
                                        </EmojiContainer> : null
                                    }
                                </div> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="clear-both"></div>
        </>
    )
}

export const EmojiContainer = styled.div`
    background: white;
    position: absolute; 
    display: flex;
    margin-top: 5px;
    padding: 5px;
    border-radius: 10px;
`

export const EmojiExist = styled.span`
    position: absolute;
    bottom: -5px;
    right: -5px;
    background: white;
    color: gray;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
`