
import { getEmojiIcon } from "@/utils/getEmojiData";
import {useSelector} from 'react-redux'
import { selectAppState } from "@/redux/appSlice";
import { ImageInMessageType } from "@/types/ImageInMessageType";
import { MessageType } from "@/types/MessageType";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { SentIcon } from "./SenderTemplateText";
import DropdownActionMessage from "../DropdownActionMessage";

export default function SenderTemplateTextImage(
    { 
        imgs, 
        message, 
        timestamp,
        lastIndex,
        scrollToBottom 
    }: {
        imgs: Array<ImageInMessageType>,
        message: MessageType,
        timestamp: any,
        lastIndex: boolean,
        scrollToBottom: any
}) {

    const appState  = useSelector(selectAppState)

    const handleMessage = () => {
        let messageExport: string = message.message;
        if (message.type === "text-image") {
            imgs?.forEach((img) => {
            messageExport = messageExport.replace(
              img?.key,
              `<img
                className="image-in-message"
                loading="lazy"
                decoding="async" 
                src="${img?.url}"
                style="color: transparent;"/>`
            );
          });
        }
        return <div 
                dangerouslySetInnerHTML={{ __html: messageExport }} 
                style={{fontSize: message.type === 'text' && getEmojiIcon.includes(message.message) && message.message.length === 2 ? '50px' : '' }}>
                </div>;
      };

    return (
        <>
            <div className="intro-x chat-text-box flex items-end float-right mb-4">
            <div className="w-full">
                <div>
                    <div className="chat-text-box__content flex items-center float-right" title={timestamp}>
                        {/* Message content */}
                        <div className="box leading-relaxed bg-theme-1 text-opacity-80 text-white px-4 py-3 mt-3"> {handleMessage()} </div>
                    </div>
                </div>
            </div>
            <div className="ml-4">
            </div>
        </div>
        <div className="clear-both"></div>
        </>
    )
}
