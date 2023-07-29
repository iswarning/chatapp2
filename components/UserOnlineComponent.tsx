import { auth } from "@/firebase";
import { selectAppState } from "@/redux/appSlice";
import { selectFriendState } from "@/redux/friendSlice";
import { selectVideoCallState } from "@/redux/videoCallSlice";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSelector, useDispatch } from 'react-redux'

export default function UserOnlineComponent({ userOn }: { userOn: string }) {
    const [user] = useAuthState(auth);
    const appState = useSelector(selectAppState)
    const videoCallState = useSelector(selectVideoCallState)
    const friendState = useSelector(selectFriendState)
    const dispatch = useDispatch()

    const friend = friendState.listFriend.find((friend) => ( friend.senderId === appState.userInfo._id ? friend.recipientId : friend.senderId ) === userOn)

    const handleCalling = async(event: any, userInfo: any) => {
        event.preventDefault()
    }
    
    return (
        <>
        {
            friendState.listFriend.length > 0  ? <a href="" className="w-12 mr-3 cursor-pointer tooltip">
                <div className="w-12 h-12 flex-none image-fit rounded-full">
                {
                    friend?.userInfo?.photoURL ? <Image 
                        src={friend?.userInfo?.photoURL}
                        width={48}
                        height={48}
                        alt="Avatar User"
                        className="rounded-full"
                        onClick={(event) => handleCalling(event, friend?.userInfo)}
                    /> : null
                }
                <div className="bg-green-500 border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2"></div>
                </div>
                <div className="text-gray-600 dark:text-gray-500 truncate text-center mt-2">{friend?.userInfo?.fullName}</div>
            </a> : null
        }
        </>
        
    )
}