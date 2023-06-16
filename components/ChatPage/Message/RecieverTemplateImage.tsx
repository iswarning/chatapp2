import TimeAgo from "timeago-react";
import Image from "next/image";
import { ImageAttachType } from "@/types/ImageAttachType";
import { MessageType } from "@/types/MessageType";
import ActionMessage from "./ActionMessage";

export default function RecieverTemplateImage({imgs, message, showAvatar, photoURL, timestamp}: { imgs: Array<ImageAttachType> | undefined, message: MessageType, showAvatar: string | null, photoURL: string | null, timestamp: any }) {

    return (
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
                        <div className="rounded-md text-gray-700 chat-text-box__content__text--image flex justify-end mt-3">
                        {
                            imgs && imgs?.length > 0 ? imgs.map((img) => <div key={img.key} className="tooltip w-16 h-16 image-fit zoom-in">
                                <img alt="" className="rounded-md" src={img.url}/>
                            </div> ) : null
                        }
                        </div>
                        <ActionMessage />
                    </div>
                    <div className="clear-both"></div>
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
    )
}