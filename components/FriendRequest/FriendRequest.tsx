import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";

export default function FriendRequest({ id, senderEmail, recipientEmail}: any) {

    const [user] = useAuthState(auth);

    const [recipientUserSnapshot] = useCollection(
        db
        .collection("users")
        .where("email",'==',senderEmail)
    )

    const recipientUser = recipientUserSnapshot?.docs?.[0]?.data();

    const onAccept = async() => {
        await db
        .collection("friends")
        .add({
            users: [user?.email, recipientUser?.email],
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    }

    const onCancel = async() => {
        const friend = await db
            .collection('friend_requests')
            .doc(id)
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
                <p className="text-gray-500">Software Engineer</p>
            </div>
            <div className="p-4 border-t mt-2 mx-auto d-flex">
                <button className="w-1/2 block mx-2 rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2" onClick={() => onAccept}>Accept</button>
                <button className="w-1/2 block mx-2 rounded-full hover:shadow-lg font-semibold text-black px-6 py-2" onClick={() => onCancel} style={{border: '1px solid'}}>Cancel</button>
            </div>
        </div>
    )
}