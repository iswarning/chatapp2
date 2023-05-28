import { auth, db } from "@/firebase";
import getRecipientEmail from "@/utils/getRecipientEmail";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import Image from 'next/image';
import TimeAgo from "timeago-react";

export default function Chat({ chat }: any) {

    const [user] = useAuthState(auth);
    const router = useRouter();

    const [recipientSnapshot] = useCollection(
        db
        .collection("users")
        .where("email",'==', getRecipientEmail(chat.users, user))
    )

    const [lastMessageSnapshot] = useCollection(
        db
        .collection("chats")
        .doc(chat.id)
        .collection("messages")
        .orderBy("timestamp")
        .limitToLast(1)
    );

    const lastMessage = lastMessageSnapshot?.docs?.[0]?.data();

    const [userInfoOfLastMessageSnapshot] = useCollection(
        db
        .collection("users")
        .where("email",'==', String(lastMessage?.user))
    )

    const [messageSnapshot] = useCollection(
        db
        .collection("chats")
        .doc(chat.id)
        .collection("messages")
        .where("user",'!=',user?.email)
    );

    const amountUnSeenMsg = messageSnapshot?.docs?.filter((mess) => !mess?.data()?.seen?.includes(user?.email));

    const handleShowChatScreen = () => {
        router.push(`/chat/${chat.id}`)
    }

    const getRecipientAvatar = () => {
        if(chat?.isGroup) {
            if(chat?.photoURL.length > 0)
                return chat?.photoURL
            else
                return "/images/group-default.jpg"
        } else {
            let photoUrl = recipientSnapshot?.docs?.[0].data().photoURL
            if(photoUrl?.length > 0)
                return photoUrl
            else return "/images/avatar-default.png"
        }
    }

    const handleShowLastMessage = () => {
        if (chat.isGroup) {
            return userInfoOfLastMessageSnapshot?.docs?.[0]?.data()?.fullName + ': ' + lastMessage?.message
        } else {
            if (lastMessage?.user === user?.email) {
                return 'You: ' + lastMessage?.message
            } else return lastMessage?.message
        }
    }

    return (
        <div className={"entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white mb-4 rounded p-4 flex shadow-md" + (chat.id === router.query.id ? " border-l-4 border-red-500" : "") } onClick={handleShowChatScreen}>
            <div className="flex-2">
                <div className="w-12 h-12 relative">
                    <CustomAvatar
                        src={getRecipientAvatar()}
                        width={50}
                        height={50}
                        alt="User Avatar"
                    />
                    <span className="absolute w-4 h-4 bg-green-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
                </div>
            </div>
            <div className="flex-1 px-2">
                <div className="truncate w-40"><span className="text-gray-800">{chat.isGroup ? 'Group: ' + chat.name : recipientSnapshot?.docs?.[0].data().fullName}</span></div>
                <div className="truncate w-40"><small className="text-gray-600 ">{lastMessageSnapshot?.docs.length! > 0 ? handleShowLastMessage() : null}</small></div>
            </div>
            <div className="flex-2 text-right">
                <div>
                    <small className="text-gray-500">
                        <p>
                            {lastMessageSnapshot?.docs.length! > 0 ? lastMessage?.timestamp?.toDate() ? (
                                <TimeAgo datetime={lastMessage?.timestamp?.toDate()} />
                            ) : (
                                "Unavailable"
                            ) : null}
                        </p>
                    </small>
                </div>
                <div>
                    {
                        amountUnSeenMsg?.length! > 0 ?
                       <small className="text-xs bg-red-500 text-white rounded-full h-6 w-6 leading-6 text-center inline-block">
                            { amountUnSeenMsg?.length! }
                        </small> : null
                    }
                </div>
            </div>
        </div>
    )

}

export const CustomAvatar = styled(Image)`
    border-radius: 50%;
`