import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { useEffect, useState } from "react";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MailIcon from '@mui/icons-material/Mail';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { CustomAvatar } from "../../ChatPage/Chat";
import ShowStatusFriend from "../../ShowStatusFriend/ShowStatusFriend";
import { useCollection } from "react-firebase-hooks/firestore";
import getStatusFriend from "@/utils/getStatusFriend";

function UserDetailScreen({userInfo}: any) {

    const [status, setStatus] = useState('');

    const [user] = useAuthState(auth);

    useEffect(() => {
        getStatusFriend(user?.email!, userInfo?.email).then((s) => setStatus(s)).catch(err => console.log(err))
    },[status])

    // const [friendRequestSnapshot] = useCollection(
    //     db
    //     .collection("friend_requests")
    //     .where("senderEmail",'==',user?.email)
    //     .where("recipientEmail",'==',userInfo?.email)
    // )

    // useEffect(() => {
    //     getStatusFriend();
    // },[friendRequestSnapshot])

    // const [pendingAcceptSnapshot] = useCollection(
    //     db
    //     .collection("friend_requests")
    //     .where("recipientEmail",'==',user?.email)
    //     .where("senderEmail",'==',userInfo?.email)
    // )

    // const [friendSnapshot] = useCollection(
    //     db
    //     .collection("friends")
    //     .where("users",'array-contains',user?.email)
    // )

    // const getStatusFriend = () => {

    //     if (friendRequestSnapshot?.docs?.length! > 0) {
    //         setStatus('isFriendRequest')
    //     }

    //     if (pendingAcceptSnapshot?.docs?.length! > 0) {
    //         setStatus('isPendingAccept')
    //     }

    //     if (friendSnapshot?.docs?.length! > 0) {
    //         if (friendRequestSnapshot?.docs?.find((f) => f.data().users.includes(userInfo?.email))) {
    //             setStatus('isFriend')
    //         }
    //     }
    //     setStatus('isStranger')
    // }

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
                                <ShowStatusFriend userInfo={userInfo} statusFriend={status} />
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
                            <MailIcon fontSize='small' />&nbsp;{userInfo?.email}
                        </div>
                        <div className="mb-2 text-blueGray-600">
                            <LocalPhoneIcon fontSize='small' />&nbsp;{parsePhoneNumber(userInfo?.phoneNumber)}
                        </div>
                        <div className="mt-10 pt-10 border-t border-blueGray-200 text-center">
                            <div className="flex flex-wrap justify-center">
                                <div className="w-full lg:w-9/12 px-4">
                                    <div className="mb-4 text-lg leading-relaxed text-blueGray-700 pb-2">
                                    An artist of considerable range, Jenna the name taken by
                                    Melbourne-raised, Brooklyn-based Nick Murphy writes,
                                    performs and records all of his own music, giving it a
                                    warm, intimate feel with a solid groove structure. An
                                    artist of considerable range.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
        </div>
    )

}

const parsePhoneNumber = (phone: string) => {
    if (phone.length === 10) {
        console.log(phone)
        return phone.slice(0, 4) + '.' + phone.slice(4, 7) + '.' + phone.slice(7, 10)
    }
}
export default UserDetailScreen