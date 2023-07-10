import Image from "next/image";
import StatusSend from "./StatusSend";
import { FileInfo } from "@/types/ChatType";

export default function SenderTemplateImage(
    { 
        files, 
        timestamp, 
        onShowImage,
        lastIndex
    }: { 
        files: Array<FileInfo> | undefined , 
        timestamp: any, 
        onShowImage: any,
        lastIndex: boolean
    }) {

    return (
        <>
        <div className="intro-x chat-text-box flex items-end float-right mb-4" title={timestamp}>
            <div className="w-full">
                <div>
                    <div className="chat-text-box__content flex items-center float-right" title={timestamp}>
                        <div className="rounded-md text-gray-700 chat-text-box__content__text--image flex justify-end mt-3">
                            {
                                files?.map((img, i) => <div key={img.key} className={ i === 0 ? "tooltip w-16 h-16 image-fit zoom-in" : "tooltip w-16 h-16 image-fit zoom-in ml-2"} onClick={() => onShowImage(img.url)}>
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
            </div>
            <StatusSend lastIndex={lastIndex} />
        </div>
        <div className="clear-both"></div>
        </>
    )
}