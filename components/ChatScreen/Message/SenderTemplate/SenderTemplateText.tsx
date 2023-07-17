import { getEmojiIcon } from "@/utils/getEmojiData";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import styled from "styled-components";
import { useSelector } from 'react-redux'
import { selectAppState } from "@/redux/appSlice";
import { MessageType } from "@/types/MessageType";
import StatusSend from "./StatusSend";

export default function SenderTemplateText(
    { 
        message, 
        timestamp, 
        lastIndex 
    }: { 
        message: MessageType, 
        timestamp: any, 
        lastIndex: boolean 
    }) {

    const appState = useSelector(selectAppState)

    const handleMessage = () => {
        let messageExport: string = message.message!;
        return <div 
            dangerouslySetInnerHTML={{ __html: messageExport }} 
            style={{fontSize: message.type === 'text' && getEmojiIcon.includes(message.message!) && message.message!.length === 2 ? '50px' : '' }}>
            </div>;
    }

    return (
        <>
        <div className="chat-text-box flex items-end float-right mb-4" title={timestamp}>
            <div className="w-full">
                <div>
                    <div className="chat-text-box__content flex items-center float-right" >
                        {/* Message content */}
                        <div className="box leading-relaxed bg-theme-1 text-opacity-80 text-white px-4 py-3 mt-3"> {handleMessage()} </div>
                    </div>
                </div>
            </div>
            <StatusSend lastIndex={lastIndex} />
        </div>
        <div className="clear-both"></div>
    </>
    )
}

export const SentIcon = styled(CheckCircleOutlineIcon)`
    background: #2D3748;
    color: white;
    border-radius: 10px;
`