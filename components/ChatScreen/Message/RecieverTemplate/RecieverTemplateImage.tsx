import { ImageAttachType } from "@/types/ImageAttachType";
import DropdownActionMessage from "../DropdownActionMessage";

export default function RecieverTemplateImage({imgs, timestamp, lastIndex, onShowImage}: { imgs: Array<ImageAttachType> | undefined, timestamp: any, lastIndex: boolean, onShowImage: any }) {


    return (
        <>
            <div className="-intro-x chat-text-box flex items-end float-left mb-4" title={timestamp}>
                <div className="mr-4">

                </div>
                <div className="w-full">
                    <div>
                        <div className="chat-text-box__content flex items-center float-left" title={ timestamp }>
                            <div className="rounded-md text-gray-700 chat-text-box__content__text--image flex justify-end mt-3">
                            {
                                imgs && imgs?.length > 0 ? imgs.map((img, i) => <div key={img.key} className={ i === 0 ? "tooltip w-16 h-16 image-fit zoom-in" : "tooltip w-16 h-16 image-fit zoom-in ml-2"} onClick={() => onShowImage(img.url)}>
                                    <img alt="" className="rounded-md" src={img.url}/>
                                </div> ) : null
                            }
                            </div>
                            <DropdownActionMessage />
                        </div>
                        
                    </div>
                </div>
            </div>
            <div className="clear-both"></div>
        </>

    )
}