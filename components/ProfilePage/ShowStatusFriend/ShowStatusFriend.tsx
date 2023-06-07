import { auth, db } from "@/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
import { io } from "socket.io-client";
import sendNotificationFCM from "@/utils/sendNotificationFCM";

export default function ShowStatusFriend({userInfo, statusFriend}: any) {
    
    const [user] = useAuthState(auth);
    const [status, setStatus] = useState(statusFriend);
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);

    useEffect(() => {
        socket.on("response-notify", (msg: any) => {
            const data = JSON.parse(msg);
            if(data.type === 'accept-friend' && data.recipient === user?.email) {
                setStatus('isFriend');
            }
          });
          return () => {
            socket.disconnect()
          }
    },[])

    const onAddFriend = async() => {
        await db
        .collection('friend_requests')
        .add({
            senderEmail: user?.email,
            recipientEmail: userInfo?.email!,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        // socket.emit("send-notify", JSON.stringify({
        //     sender: user?.email,
        //     recipient: userInfo?.email,
        //     name: user?.displayName,
        //     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        //     type: 'send-add-friend'
        // }))
        setStatus('isFriendRequest');
        sendNotificationFCM(
            'Notification',
            user?.displayName + 'sent a friend request',
            userInfo?.fcm_token
        ).catch(err => console.log(err))
    }

    const onCancelFriendRequest = async() => {
        const fR = await db
            .collection('friend_requests')
            .where("senderEmail",'==',user?.email)
            .where("recipientEmail",'==',userInfo?.email)
            .get();

        const batch = db.batch();

        batch.delete(fR?.docs?.[0]?.ref);

        await batch.commit();
        
        setStatus('isStranger');
    }

    const onUnFriend = async() => {
        if (confirm('Do you want to unfriend?')) {
            const friendSnapshot = await db.collection("friends").where("users",'array-contains',user?.email).get();
            if (friendSnapshot) {
                
                const isFriend = friendSnapshot?.docs?.find((f) => f.data().users.includes(userInfo?.email))

                if (isFriend?.exists) {
                    const batch = db.batch();

                    batch.delete(isFriend?.ref);

                    await batch.commit();

                    setStatus('isStranger');
                }
            }
        }
    }

    const showStatusFriend = () => {
        switch(status.length > 0 ? status : statusFriend) {
            case 'isStranger':
                return <div className="flex justify-center py-4 lg:pt-4 pt-8">
                            <button 
                                className="block mx-2 rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2" 
                                onClick={onAddFriend}>Add friend</button>
                            <button 
                                className="block mx-2 rounded-full hover:shadow-lg font-semibold text-black px-6 py-2" 
                                style={{border: '1px solid'}}
                                onClick={onAddFriend}>Send Message</button>
                        </div>
            case 'isFriendRequest':
                return <div className="flex justify-center py-4 lg:pt-4 pt-8">
                            <button 
                                className="block mx-2 rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2" 
                                onClick={onCancelFriendRequest}>Cancel Request</button>
                            <button 
                                className="block mx-2 rounded-full hover:shadow-lg font-semibold text-black px-6 py-2" 
                                style={{border: '1px solid'}}
                                onClick={onCancelFriendRequest}>Send Message</button>
                        </div>
            case 'isFriend':
                return <div className="flex justify-center py-4 lg:pt-4 pt-8">
                            <button 
                                className="block mx-2 rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2" 
                                onClick={onUnFriend}>Unfriend</button>
                            <button 
                                className="block mx-2 rounded-full hover:shadow-lg font-semibold text-black px-6 py-2" 
                                style={{border: '1px solid'}}
                                onClick={onUnFriend}>Send Message</button>
                        </div>
            case 'isPendingAccept':
                return <div className="flex justify-center py-4 lg:pt-4 pt-8">
                            <button 
                                className="block mx-2 rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2" 
                                disabled>Pending Accept</button>
                            <button 
                                className="block mx-2 rounded-full hover:shadow-lg font-semibold text-black px-6 py-2" 
                                style={{border: '1px solid'}}
                                onClick={onCancelFriendRequest}>Send Message</button>
                        </div>
                
        }
    }

    return (
        <>
            {showStatusFriend()}
        </>
    )

}