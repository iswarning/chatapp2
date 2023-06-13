import { auth, db } from "@/firebase";
import { selectAppState } from "@/redux/appSlice";
import { ChatType } from "@/types/ChatType";
import getRecipientEmail from "@/utils/getRecipientEmail";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useSelector } from 'react-redux'

export default function UserOnlineComponent({ userOn }: { userOn: string }) {
    const [user] = useAuthState(auth);
    const appState = useSelector(selectAppState)

    const [recipientSnapshot] = useCollection(
        db
          .collection("users")
          .where("email", "==", userOn)
      );
    
    return (
        <a href="" className="w-12 mr-3 cursor-pointer tooltip">
            <div className="w-12 h-12 flex-none image-fit rounded-full">
            <Image 
                src={recipientSnapshot?.docs?.[0]?.data().photoURL}
                width={48}
                height={48}
                alt="Avatar User"
                className="rounded-full"
            />
            <div className="bg-green-500 border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2"></div>
            </div>
            <div className="text-gray-600 dark:text-gray-500 truncate text-center mt-2">{recipientSnapshot?.docs?.[0]?.data().fullName}</div>
        </a>
    )
}