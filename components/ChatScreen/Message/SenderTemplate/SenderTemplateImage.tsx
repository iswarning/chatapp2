import { ImageAttachType } from "@/types/ImageAttachType";
import { MessageType } from "@/types/MessageType";
import Image from "next/image";
import TimeAgo from "timeago-react";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import {useSelector} from 'react-redux'
import { selectAppState } from "@/redux/appSlice";
import { SentIcon } from "./SenderTemplateText";

export default function SenderTemplateImage(
    { 
        imgs, 
        timestamp, 
        onShowImage,
        lastIndex
    }: { 
        imgs: Array<ImageAttachType> | undefined , 
        timestamp: any, 
        onShowImage: any,
        lastIndex: boolean
    }) {

    const appState = useSelector(selectAppState)

    return (
        <>
        <div className="intro-x chat-text-box flex items-end float-right mb-4">
            <div className="w-full">
                <div>
                    <div className="chat-text-box__content flex items-center float-right" title={timestamp}>
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
            </div>
            <div className="ml-4">
            </div>
        </div>
        <div className="clear-both"></div>
        </>
    )
}