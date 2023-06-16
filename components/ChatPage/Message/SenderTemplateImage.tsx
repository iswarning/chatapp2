import { ImageAttachType } from "@/types/ImageAttachType";
import { MessageType } from "@/types/MessageType";
import Image from "next/image";
import TimeAgo from "timeago-react";
import ActionMessage from "./ActionMessage";

export default function SenderTemplateImage({imgs, message, showAvatar, photoURL, timestamp, onShowImage}: { imgs: Array<ImageAttachType> | undefined, message: MessageType, showAvatar: string | null, photoURL: string | null, timestamp: any, onShowImage: any }) {

    return (
        <>
        <div className="intro-x chat-text-box flex items-end float-right mb-4">
            <div className="w-full">
                <div>
                    <div className="chat-text-box__content flex items-center float-right">
                        <ActionMessage />
                        <div className="rounded-md text-gray-700 chat-text-box__content__text--image flex justify-end mt-3">
                            {
                                imgs?.map((img, i) => <div key={img.key} className={ i === 0 ? "tooltip w-16 h-16 image-fit zoom-in" : "tooltip w-16 h-16 image-fit zoom-in ml-2"} onClick={() => onShowImage(img.url)}>
                                    <Image 
                                        src={img.url}
                                        className="rounded-md"
                                        width={64}
                                        height={64}
                                        alt=""
                                    />
                                </div>)
                            }
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
            <div className="chat-text-box__photo w-10 h-10 hidden sm:block flex-none image-fit relative ml-4">
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
        </div>
        <div className="clear-both"></div>
        </>
    )
}