import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { CustomAvatar } from "../Chat";

export default function Message({message, photoURL, showAvatar}: any) {

    const [userLoggedIn] = useAuthState(auth);

    const formatDate = (dt: any) => {
        let d = new Date(dt);
        return d.getHours() + ":" + d.getMinutes();
    }

    return (
        <>
            {
                // Sender
                message.user === userLoggedIn?.email ? <div className="message me mb-4 flex text-right">
                    <div className="flex-1 px-2">
                        <div className="inline-block bg-blue-600 rounded-full p-2 px-4 text-white" style={{backgroundColor: '#3182ce'}}>
                            <span dangerouslySetInnerHTML={{__html: message.message}}></span>
                        </div>
                        <div className="pr-4"><small className="text-gray-500">{formatDate(message.timestamp)}</small></div>
                    </div>
                </div>
                :
                // Reciever
                <div className="message mb-4 flex">
                    <div className="flex-2">
                        {
                            !showAvatar ? 
                            <div className="w-12 h-12 relative">
                                <CustomAvatar
                                    src={photoURL}
                                    width={50}
                                    height={50}
                                    alt="User Avatar"
                                />
                                <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
                            </div> : <div className="w-12 h-12 relative"></div>
                        }
                    </div>
                    <div className="flex-1 px-2">
                        <div className="inline-block bg-gray-300 rounded-full p-2 px-4 text-gray-700" style={{backgroundColor: 'rgba(226,232,240,1)'}}>
                            <span dangerouslySetInnerHTML={{__html: message.message}}></span>
                        </div>
                        <div className="pl-4"><small className="text-gray-500">{formatDate(message.timestamp)}</small></div>
                    </div>
                </div>
            }                 
        </>
    )
}



