import { auth, db } from "@/firebase";
import { selectAppState } from "@/redux/appSlice";
import { StatusCallType, selectVideoCallState, setGlobalVideoCallState } from "@/redux/videoCallSlice";
import { ChatType } from "@/types/ChatType";
import { MapUserData } from "@/types/UserType";
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
    const dispatch = useDispatch()

    const [recipientSnapshot] = useCollection(
        db
          .collection("users")
          .where("email", "==", userOn)
    );

    const recipientInfo = MapUserData(recipientSnapshot?.docs?.[0]!)

    const [friendSnapshot] = useCollection(
        db.collection("friends").where("users", "array-contains", user?.email)
    );

    const [chatSnapshot] = useCollection(
        db.collection("chats").where("users",'array-contains',user?.email)
    )

    const chatInfo = chatSnapshot?.docs?.find((chat) => chat.data().users.includes(recipientInfo.email))

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
                    chatId: chatInfo?.data()._id,
                    isGroup: chatInfo?.data().isGroup,
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
            friendSnapshot && friendSnapshot.docs.find((friend) => getRecipientEmail(friend.data().users, user) === userOn) ? <a href="" className="w-12 mr-3 cursor-pointer tooltip">
                <div className="w-12 h-12 flex-none image-fit rounded-full">
                {
                    recipientInfo?.photoURL ? <Image 
                        src={recipientInfo.photoURL}
                        width={48}
                        height={48}
                        alt="Avatar User"
                        className="rounded-full"
                        onClick={(event) => handleCalling(event, recipientInfo)}
                    /> : null
                }
                <div className="bg-green-500 border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2"></div>
                </div>
                <div className="text-gray-600 dark:text-gray-500 truncate text-center mt-2">{recipientInfo.fullName}</div>
            </a> : null
        }
        </>
        
    )
}