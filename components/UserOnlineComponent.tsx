import { auth, db } from "@/firebase";
import { selectAppState } from "@/redux/appSlice";
import { selectFriendState } from "@/redux/friendSlice";
import { StatusCallType, selectVideoCallState, setGlobalVideoCallState } from "@/redux/videoCallSlice";
import getRecipientEmail from "@/utils/getRecipientEmail";
import getUserBusy from "@/utils/getUserBusy";
import { requestMedia } from "@/utils/requestPermission";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useSelector, useDispatch } from 'react-redux'
import { toast } from "react-toastify";

export default function UserOnlineComponent({ userOn }: { userOn: string }) {
    const [user] = useAuthState(auth);
    const appState = useSelector(selectAppState)
    const videoCallState = useSelector(selectVideoCallState)
    const friendState = useSelector(selectFriendState)
    const dispatch = useDispatch()

    const friend = friendState.listFriend.find((friend) => ( friend.senderId === appState.userInfo._id ? friend.recipientId : friend.senderId ) === userOn)

    const handleCalling = async(event: any, userInfo: any) => {
        event.preventDefault()
        let userBusy = await getUserBusy();

        if(!videoCallState.showVideoCallScreen) {

            if(userBusy.includes(userInfo.email) || !appState.userOnline.find((userOn) => userInfo.email === userOn)) {

                toast(`${userInfo.fullName} is busy`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
                return;

            } else {
                const checkPermission = await requestMedia()

                if (!checkPermission) {
                    toast(`Please allow using camera and microphone`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
                    return;
                }

                dispatch(setGlobalVideoCallState({
                    type: "setShowVideoCallScreen",
                    data: true
                }))
                dispatch(setGlobalVideoCallState({
                    type: "setStatusCall",
                    data: StatusCallType.CALLING
                }));
                let data = {
                    sender: user?.email,
                    recipient: userInfo.email,
                    // chatId: chatInfo?.data()._id,
                    // isGroup: chatInfo?.data().isGroup,
                    photoURL: userInfo.photoURL,
                }
                dispatch(setGlobalVideoCallState({
                    type: "setDataVideoCall",
                    data: data
                }))
                appState.socket.emit("call-video-one-to-one", JSON.stringify(data));
            }
        }
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