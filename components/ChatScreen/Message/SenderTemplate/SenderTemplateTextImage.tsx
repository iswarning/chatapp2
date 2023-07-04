
import { getEmojiIcon } from "@/utils/getEmojiData";
import {useSelector} from 'react-redux'
import { selectAppState } from "@/redux/appSlice";
import { ImageInMessageType } from "@/types/ImageInMessageType";
import { MessageType } from "@/types/MessageType";
import StatusSend from "./StatusSend";
import { useEffect, useState } from "react";
import { storage } from "@/firebase";

export default function SenderTemplateTextImage(
    { 
        message, 
        timestamp,
        lastIndex,
        scrollToBottom 
    }: {
        message: MessageType,
        timestamp: any,
        lastIndex: boolean,
        scrollToBottom: any
}) {

    const handleMessage = () => {
        let messageExport: string = message.message;
        let images = JSON.parse(message.images!)
        if (message.type === "text-image") {
            images?.forEach((image: any) => {
                messageExport = messageExport.replace(
                    image?.key,
                  `<img src=${image.downloadUrl} loading="lazy" decoding="async" class="image-in-message" />`
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
            <StatusSend lastIndex={lastIndex} />
        </div>
        <div className="clear-both"></div>
        </>
    )
}
