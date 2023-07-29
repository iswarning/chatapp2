
import {useSelector} from 'react-redux'
import { selectChatState } from "@/redux/chatSlice";
import styled from "@emotion/styled";
import StatusSend from './StatusSend';
export default function SenderTemplateImage(
    { 
        message, 
        timestamp, 
        onShowImage,
        lastIndex,
        scroll,
        handleReaction
    }: { 
        message: string , 
        timestamp: any, 
        onShowImage: any,
        lastIndex: boolean,
        scroll: any,
        handleReaction: any
    }) {
    const chatState = useSelector(selectChatState)
    const data = chatState.listChat.find((chat) => chatState.currentChat.chatRoomId === chat._id)?.listImage?.filter((image) => JSON.parse(message).find((key: any) => key === image.key))

    return (
        <>
        <div className="chat-text-box flex items-end float-right mb-4" title={timestamp} style={{maxWidth: "500px"}}>
            <div className="w-full">
                <div>
                    <div className="chat-text-box__content flex items-center float-right" title={timestamp}>
                        <div className="rounded-md text-gray-700 chat-text-box__content__text--image flex justify-end mt-3" style={{flexWrap: "wrap-reverse"}}>
                            {
                                data?.map((file) => {
                                    return <Image 
                                    onLoad={() => scroll()} 
                                    loading='lazy' 
                                    decoding='async' 
                                    key={file.key} 
                                    src={file.url}
                                    />
                                })
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

const Image = styled.img`
    border-radius: 10px;
    padding: 4px;
    width: 150px;
    height: 150px;
    max-width: 150px;
    flex: 33%;
`