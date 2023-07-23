import {useSelector} from 'react-redux'
import { selectChatState } from "@/redux/chatSlice";
import styled from "@emotion/styled";
import DropdownActionMessage from '../DropdownActionMessage';
import { ChatType } from '@/types/ChatType';
import { MessageType } from '@/types/MessageType';

export default function RecieverTemplateImage({ 
    showAvatar, 
    chat, 
    message, 
    timestamp, 
    lastIndex, 
    onShowImage, 
    scroll, 
    handleReaction
} : { 
    showAvatar: boolean, 
    chat: ChatType, 
    message: MessageType, 
    timestamp: any, 
    lastIndex: boolean, 
    onShowImage: any, 
    scroll: any,
    handleReaction: any 
}) {

    const chatState = useSelector(selectChatState)
    const data = chatState.listChat.find((c) => chat._id === c._id)?.listImage?.filter((image) => JSON.parse(message.message!).find((key: string) => key === image.key))

    return (
        <>
            <div className="-intro-x chat-text-box flex items-end float-left mb-4" title={timestamp}>
                {
                    chat.isGroup && showAvatar ? <div className="chat-text-box__photo w-10 h-10 hidden sm:block flex-none image-fit relative mr-4">
                        <Image
                        src={chat.listRecipientInfo?.find((info) => info._id === message.senderId)?.photoURL!}
                        width={64}
                        height={64}
                        alt=""
                        className="rounded-full mt-6"
                        />
                    </div> : <div className="chat-text-box__photo w-10 h-10 hidden sm:block flex-none image-fit relative mr-4"></div>
                }
                <div className="w-full">
                    <div>
                        <div className="chat-text-box__content flex items-center float-left" title={ timestamp }>
                            <div className="rounded-md text-gray-700 chat-text-box__content__text--image flex justify-end mt-3">
                            {
                                data?.map((file) => {
                                    return <Image onLoad={() => scroll()} loading='lazy' decoding='async' key={file.key} src={file.url}/>
                                })
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

const Image = styled.img`
    border-radius: 10px;
    padding: 4px;
    width: 150px;
    height: 150px;
    flex: 33%;
`