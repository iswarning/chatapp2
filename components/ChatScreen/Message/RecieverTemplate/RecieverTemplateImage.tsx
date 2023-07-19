import {useSelector} from 'react-redux'
import { selectChatState } from "@/redux/chatSlice";
import styled from "@emotion/styled";
import DropdownActionMessage from '../DropdownActionMessage';

export default function RecieverTemplateImage({message, timestamp, lastIndex, onShowImage, scroll}: { message: string, timestamp: any, lastIndex: boolean, onShowImage: any, scroll: any }) {

    const chatState = useSelector(selectChatState)
    const data = chatState.listChat.find((chat) => chatState.currentChat._id === chat._id)?.listImage?.filter((image) => JSON.parse(message).find((key: string) => key === image.key))

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