import { getEmojiIcon } from "@/utils/getEmojiData";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import styled from "styled-components";
import { useSelector } from 'react-redux'
import { selectAppState } from "@/redux/appSlice";
import { MessageType } from "@/types/MessageType";
import StatusSend from "./StatusSend";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import ReplyIcon from '@mui/icons-material/Reply';
import { useState } from "react";

export default function SenderTemplateText(
    { 
        message, 
        timestamp, 
        lastIndex, 
        handleReaction
    }: { 
        message: MessageType, 
        timestamp: any, 
        lastIndex: boolean,
        handleReaction: any
    }) {

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
        <div className="chat-text-box flex items-end float-right mb-4" title={timestamp} >
            
            <div className="w-full">
                <div>
                    <div 
                    className="chat-text-box__content flex items-center float-right" 
                    onMouseEnter={() => setShowAction(true)}
                    onMouseLeave={() => {setShowAction(false); setShowEmoji(false)}}
                    >
                        {
                            showAction ? <div className="hidden sm:block dropdown relative mr-3 mt-3">
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
                        <div className="box leading-relaxed bg-theme-1 text-opacity-80 text-white px-4 py-3 mt-3" style={{position: "relative"}}>
                             {handleMessage()} 
                             {
                                message.reaction?.length! > 0 ? 
                                <EmojiExist>
                                    {(JSON.parse(message.reaction!))[(JSON.parse(message.reaction!)).length! - 1].emoji}
                                </EmojiExist> : null
                            }
                        </div>
                    </div>
                </div>
            </div>
            <StatusSend lastIndex={lastIndex} />
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
    right: 0;
    padding: 5px;
    border-radius: 10px;
`

export const EmojiExist = styled.span`
    position: absolute;
    bottom: -5px;
    left: -5px;
    background: white;
    color: gray;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
`

export const SentIcon = styled(CheckCircleOutlineIcon)`
    background: #2D3748;
    color: white;
    border-radius: 10px;
`