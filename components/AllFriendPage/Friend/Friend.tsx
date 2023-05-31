import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "@/utils/getRecipientEmail";
import { useCollection, useCollectionOnce } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";

export default function Friend({data}: any) {

    const [user] = useAuthState(auth);
    const router = useRouter();

    const [recipientUserSnapshot] = useCollection(
        db
        .collection("users")
        .where("email",'==', getRecipientEmail(data.users, user))
    )

    const recipientUser = recipientUserSnapshot?.docs?.[0]?.data();

    const onUnfriend = () => {
        if(confirm('Do you want to unfriend?')){
            deleteFriend().catch((err) => console.log(err));
        }
    }

    const [chatSnapshot] = useCollectionOnce(
        db
        .collection("chats")
        .where("users", 'array-contains', user?.email)
    )

    const onChat = () => {
        const chat = chatSnapshot?.docs?.find(chat => chat.data().users.includes(getRecipientEmail(data.users, user)));
        router.push(`/chat/${chat?.id}`).catch(err => console.log(err))
    }

    const deleteFriend = async() => {
        const friend = await db
            .collection('friends')
            .doc(data.id)
            .get();

        const batch = db.batch();

        batch.delete(friend.ref);

        await batch.commit();
    }

    return (
        <div className="col-xl-3 sm:mx-3 md:mx-3 lg:mx-2 xl:mx-2 mt-16 bg-white shadow-xl rounded-lg text-gray-900" style={{padding: 0}}>
            <div className="rounded-t-lg h-32 overflow-hidden">
                <img className="w-full" src='/images/cover-image.jpg' alt='Mountain'/>
            </div>
            <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
                <img className="object-cover object-center h-32" src={recipientUser?.photoURL} alt='Woman looking front'/>
            </div>
            <div className="text-center mt-2">
                <h2 className="font-semibold">{recipientUser?.fullName}</h2>
                <div className="text-gray-500 pb-2">Software Engineer</div>
            </div>
            <div className="p-4 border-t mt-2 mx-auto d-flex">
                <button className="w-1/2 block mx-2 rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2" onClick={onChat}>Chat</button>
                <button className="w-1/2 block mx-2 rounded-full hover:shadow-lg font-semibold text-black px-6 py-2" onClick={onUnfriend} style={{border: '1px solid'}}>Unfriend</button>
            </div>
        </div>
    )
}