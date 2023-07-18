
import { getEmojiIcon } from "@/utils/getEmojiData";
import { MessageType } from "@/types/MessageType";
import StatusSend from "./StatusSend";
import { FileInfo } from "@/types/ChatType";
import ReactDOM from "react-dom";
import { useEffect } from "react";

export default function SenderTemplateTextImage(
    { 
        message,
        imgs, 
        timestamp,
        lastIndex,
        scrollToBottom,
        onShowImage
    }: {
        message: MessageType,
        imgs: FileInfo[],
        timestamp: any,
        lastIndex: boolean,
        scrollToBottom: any,
        onShowImage: any
}) {

    useEffect(() => {
        
    },[])

    const handleMessage = () => {
        let messageExport = message.message;
        let images = JSON.parse(message.images!)
        if (message.type === "text-image") {
            imgs?.forEach((image) => {
                messageExport = messageExport?.replace(
                    image?.key,
                  `<div><img src=${image.url} loading="lazy" decoding="async" id=${image.key} class="image-in-message" /></div>`
                );
          });
        }
        return <div 
                dangerouslySetInnerHTML={{ __html: messageExport! }} 
                style={{fontSize: message.type === 'text' && getEmojiIcon.includes(message.message ?? "") && message?.message?.length! === 2 ? '50px' : '' }}>
                </div>;
      };

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