import { ImageInMessageType } from "@/types/ImageInMessageType";
import { MessageType } from "@/types/MessageType";
import { getEmojiIcon } from "@/utils/getEmojiData";
import DropdownActionMessage from "../DropdownActionMessage";

export default function RecieverTemplateTextImage(
    { 
        message, 
        timestamp, 
        lastIndex
    }: 
    {  
        message: MessageType, 
        timestamp: any, 
        lastIndex: boolean 
    }) {

        const handleMessage = () => {
            let messageExport: string = message.message;
            let images = JSON.parse(message.images!)
            if (message.type === "text-image") {
                images?.forEach((image: any) => {
                messageExport = messageExport.replace(
                    image?.key,
                  `<img
                    className="image-in-message"
                    loading="lazy"
                    decoding="async" 
                    src="${image?.downloadUrl}"
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
        <div className="-intro-x chat-text-box flex items-end float-left mb-4">
                <div className="mr-4">
                </div>
                <div className="w-full">
                    <div>
                        <div className="chat-text-box__content flex items-center float-left" title={timestamp}>
                            
                            <div className="box leading-relaxed dark:text-gray-300 text-gray-700 px-4 py-3 mt-3">{handleMessage()}</div>
                            <DropdownActionMessage />
                        </div>
                    </div>
                </div>
            </div>
            <div className="clear-both"></div>
    </>
    )
}