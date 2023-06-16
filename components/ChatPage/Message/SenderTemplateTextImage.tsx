import { db } from "@/firebase";
import { getEmojiIcon } from "@/utils/getEmojiData";
import Image from "next/image"
import { useCollection } from "react-firebase-hooks/firestore";
import TimeAgo from "timeago-react"
import {useSelector} from 'react-redux'
import { selectAppState } from "@/redux/appSlice";
import { ImageInMessageType } from "@/types/ImageInMessageType";
import { MessageType } from "@/types/MessageType";

export default function SenderTemplateTextImage({imgs, message, showAvatar, photoURL, timestamp}: {
    imgs: Array<ImageInMessageType>,
    message: MessageType,
    showAvatar: string,
    photoURL: string,
    timestamp: any
}) {

    const appState  = useSelector(selectAppState)

    const handleMessage = () => {
        console.log(imgs)
        let messageExport: string = message.message;
        if (message.type === "text-image") {
            imgs?.forEach((img) => {
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
                <div className="chat-text-box__photo w-10 h-10 hidden sm:block flex-none image-fit relative mr-4">
                    {
                        showAvatar && showAvatar === message.id && photoURL ? <Image
                        src={photoURL}
                        width={48}
                        height={48}
                        alt=""
                        className="rounded-full"
                        /> : null
                    }
                </div>
                <div className="w-full">
                    <div>
                        <div className="chat-text-box__content flex items-center float-left">
                        {/* Message content */}
                        <div className="box leading-relaxed dark:text-gray-300 text-gray-700 px-4 py-3 mt-3">{handleMessage()}</div>
                            <div className="hidden sm:block dropdown relative ml-3 mt-3">
                                <a href="javascript:;" className="dropdown-toggle w-4 h-4"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </a>
                                <div className="w-40">
                                    <div className="box dark:bg-dark-1 p-2">
                                        <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-corner-up-left w-4 h-4 mr-2"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg> Reply </a>
                                        <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash w-4 h-4 mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        showAvatar && showAvatar === message.id ? 
                        <>
                            <div className="clear-both mb-2"></div>
                            <div className="text-gray-600 text-xs text-right">
                                { <TimeAgo datetime={timestamp} /> }
                            </div>
                        </>
                        : null
                    }
                </div>
            </div>
            <div className="clear-both"></div>
        </>
    )
}