import { StatusFriendBtn, Container, InformationContainer, Label, SendMessageBtnUser, TextFriend, TextGroup, TextGroupCol, TextGroupRow, TextName, UpperImage, UserAvatar, UserBtnGroup, UserContainer, UserInfo, UserProfile, Value, ValueContainer } from "./UserDetailScreenStyled";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MessageIcon from '@mui/icons-material/Message';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import createNewFriendRequest from "@/services/friend-requests/createNewFriendRequest";
import getFriendRequestsByEmail from "@/services/friend-requests/getFriendRequestsByEmail";
import BlockIcon from '@mui/icons-material/Block';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import deleteFriendRequest from "@/services/friend-requests/deleteFriendRequest";
import deleteFriend from "@/services/friends/deleteFriend";
import getFriendByEmails from "@/services/friends/getFriendByEmails";
import { useEffect, useState } from "react";
import getAllFriendOfUser from "@/services/friends/getAllFriendOfUser";
import { withRouter } from "next/router";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MailIcon from '@mui/icons-material/Mail';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { CustomAvatar } from "../Chat";
import firebase from "firebase";

function UserDetailScreen({userInfo, statusFriend}: any) {

    const [status, setStatus] = useState(statusFriend);

    const [user] = useAuthState(auth);

    const onAddFriend = async() => {
        await db
        .collection('friend_requests')
        .add({
            senderEmail: user?.email,
            recipientEmail: userInfo?.email!,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        setStatus('isFriendRequest');
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
                }
            }
        }
    }

    const showStatusFriend = () => {
        switch(status) {
            case 'isStranger':
                return <div className="flex justify-center py-4 lg:pt-4 pt-8">
                            <button 
                                className="block mx-2 rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2" 
                                onClick={() => onAddFriend}>Add friend</button>
                            <button 
                                className="block mx-2 rounded-full hover:shadow-lg font-semibold text-black px-6 py-2" 
                                style={{border: '1px solid'}}
                                onClick={() => onAddFriend}>Send Message</button>
                        </div>
            case 'isFriendRequest':
                return <div className="flex justify-center py-4 lg:pt-4 pt-8">
                            <button 
                                className="block mx-2 rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2" 
                                onClick={() => onCancelFriendRequest}>Cancel Request</button>
                            <button 
                                className="block mx-2 rounded-full hover:shadow-lg font-semibold text-black px-6 py-2" 
                                style={{border: '1px solid'}}
                                onClick={() => onCancelFriendRequest}>Send Message</button>
                        </div>
            case 'isFriend':
                return <div className="flex justify-center py-4 lg:pt-4 pt-8">
                            <button 
                                className="block mx-2 rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2" 
                                onClick={() => onUnFriend}>Unfriend</button>
                            <button 
                                className="block mx-2 rounded-full hover:shadow-lg font-semibold text-black px-6 py-2" 
                                style={{border: '1px solid'}}
                                onClick={() => onUnFriend}>Send Message</button>
                        </div>
            case 'isPendingAccept':
                return <div className="flex justify-center py-4 lg:pt-4 pt-8">
                            <button 
                                className="block mx-2 rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-6 py-2" 
                                disabled>Pending Accept</button>
                            <button 
                                className="block mx-2 rounded-full hover:shadow-lg font-semibold text-black px-6 py-2" 
                                style={{border: '1px solid'}}
                                onClick={() => onCancelFriendRequest}>Send Message</button>
                        </div>
                
        }
    }

    return (
        <div className="flex-1 flex h-full profile-container">
                
                <div className='profile-card'>
                    <div className='header'>
                        <div className="flex flex-wrap justify-center">
                            <div className="mt-4 w-full lg:w-5/12 px-4 lg:order-1 mx-auto">
                                <div className="flex justify-center py-4 lg:pt-4 pt-8">
                                    <div className="mr-4 p-3 ">
                                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">22</span><span className="text-sm text-blueGray-400">Friends</span>
                                    </div>
                                    <div className="mr-4 p-3 ">
                                        <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">10</span><span className="text-sm text-blueGray-400">Photos</span>
                                    </div>
                                </div>
                            </div>
                            <div className='mt-4 w-full lg:w-3/12 px-4 lg:order-3 lg:text-center lg:self-center mx-auto'>
                                <CustomAvatar src={userInfo?.photoURL!} height={150} width={150} alt='' />
                            </div>
                            <div className="mt-4 w-full lg:w-4/12 px-4 lg:order-4 lg:self-center">
                                
                            </div>
                        </div>
                    </div>
              
                    <div className="text-center mb-12 profile-bio mx-auto">
                        <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                            Jenna Stones
                        </h3>
                        <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                            <LocationOnIcon fontSize='small' />&nbsp;Los Angeles, California
                        </div>
                        <div className="mb-2 text-blueGray-600 mt-10">
                            <MailIcon fontSize='small' />&nbsp;chivinh1998@gmail.com
                        </div>
                        <div className="mb-2 text-blueGray-600">
                            <LocalPhoneIcon fontSize='small' />&nbsp;0909.000.999
                        </div>
                        <div className="mt-10 pt-10 border-t border-blueGray-200 text-center">
                            <div className="flex flex-wrap justify-center">
                                <div className="w-full lg:w-9/12 px-4">
                                    <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
                                    An artist of considerable range, Jenna the name taken by
                                    Melbourne-raised, Brooklyn-based Nick Murphy writes,
                                    performs and records all of his own music, giving it a
                                    warm, intimate feel with a solid groove structure. An
                                    artist of considerable range.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
        </div>
    )

}
export default UserDetailScreen