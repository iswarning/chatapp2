import { ImageInMessageType } from "@/types/ImageInMessageType";
import { MessageType } from "@/types/MessageType";
import { getEmojiIcon } from "@/utils/getEmojiData";
import DropdownActionMessage from "../DropdownActionMessage";

export default function RecieverTemplateTextImage(
    { 
        imgs, 
        message, 
        timestamp, 
        lastIndex
    }: 
    { 
        imgs: Array<ImageInMessageType>, 
        message: MessageType, 
        timestamp: any, 
        lastIndex: boolean 
    }) {

    const handleMessage = () => {
        let messageExport: string = message.message;
        if (message.type === "text-image") {
            imgs?.forEach((img: any) => {
            messageExport = messageExport.replace(
              img?.key,
              `<img 
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