import { MessageType } from "@/types/MessageType";
import { getEmojiIcon } from "@/utils/getEmojiData";
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {useSelector} from 'react-redux'
import { selectChatState } from "@/redux/chatSlice";

export default function RecieverTemplateText({ message, timestamp, lastIndex }: { message: MessageType, timestamp: any, lastIndex: boolean }) {

    const chatState = useSelector(selectChatState)

    const handleMessage = () => {
        let messageExport: string = message.message;
        return <div 
            dangerouslySetInnerHTML={{ __html: messageExport }} 
            style={{fontSize: message.type === 'text' && getEmojiIcon.includes(message.message) && message.message.length === 2 ? '50px' : '' }}>
            </div>;
    }

    return (
        <>
            <div className="-intro-x chat-text-box flex items-end float-left mb-4" title={timestamp}>
                {
                    chatState.currentChat.isGroup && lastIndex ? <div className="chat-text-box__photo w-10 h-10 hidden sm:block flex-none image-fit relative mr-4">
                        <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-full" src="https://topson.left4code.com/dist/images/profile-9.jpg"/>
                    </div> : null
                }
                <div className="w-full">
                    <div>
                        <div className="chat-text-box__content flex items-center float-left" title={timestamp}>
                            
                            <div className="box leading-relaxed dark:text-gray-300 text-gray-700 px-4 py-3 mt-3">{handleMessage()}</div>
                            <div className="hidden sm:block dropdown relative mr-3 mt-3">
                                <MoreVertIcon fontSize='small'/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="clear-both"></div>
        </>
    )
}