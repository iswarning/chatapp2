import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { useEffect, useState } from "react";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MailIcon from '@mui/icons-material/Mail';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { CustomAvatar } from "../../ChatPage/Chat";
import ShowStatusFriend from "../ShowStatusFriend/ShowStatusFriend";
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
        // <div className="flex-1 flex h-full profile-container">
                
        //         <div className='profile-card'>
        //             <div className='header'>
        //                 <div className="flex flex-wrap justify-center">
        //                     <div className="mt-4 w-full lg:w-5/12 px-4 lg:order-1 mx-auto">
        //                         <div className="flex justify-center py-4 lg:pt-4 pt-8">
        //                             <div className="mr-4 p-3 ">
        //                                 <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">22</span><span className="text-sm text-blueGray-400">Friends</span>
        //                             </div>
        //                             <div className="mr-4 p-3 ">
        //                                 <span className="text-xl font-bold block uppercase tracking-wide text-blueGray-600">10</span><span className="text-sm text-blueGray-400">Photos</span>
        //                             </div>
        //                         </div>
        //                     </div>
        //                     <div className='mt-4 w-full lg:w-3/12 px-4 lg:order-3 lg:text-center lg:self-center mx-auto'>
        //                         <CustomAvatar src={userInfo?.photoURL!} height={150} width={150} alt='' />
        //                     </div>
        //                     <div className="mt-4 w-full lg:w-4/12 px-4 lg:order-4 lg:self-center">
        //                         <ShowStatusFriend userInfo={userInfo} statusFriend={status} />
        //                     </div>
        //                 </div>
        //             </div>
              
        //             <div className="text-center mb-12 profile-bio mx-auto">
        //                 <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
        //                     Jenna Stones
        //                 </h3>
        //                 <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
        //                     <LocationOnIcon fontSize='small' />&nbsp;Los Angeles, California
        //                 </div>
        //                 <div className="mb-2 text-blueGray-600 mt-10">
        //                     <MailIcon fontSize='small' />&nbsp;{userInfo?.email}
        //                 </div>
        //                 <div className="mb-2 text-blueGray-600">
        //                     <LocalPhoneIcon fontSize='small' />&nbsp;{userInfo?.phoneNumber}
        //                 </div>
        //                 <div className="mt-10 pt-10 border-t border-blueGray-200 text-center">
        //                     <div className="flex flex-wrap justify-center">
        //                         <div className="w-full lg:w-9/12 px-4">
        //                             <div className="mb-4 text-lg leading-relaxed text-blueGray-700 pb-2">
        //                             An artist of considerable range, Jenna the name taken by
        //                             Melbourne-raised, Brooklyn-based Nick Murphy writes,
        //                             performs and records all of his own music, giving it a
        //                             warm, intimate feel with a solid groove structure. An
        //                             artist of considerable range.
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
                    
        //         </div>
        // </div>
        <div>
            <div className="p-8 bg-white shadow mt-10 rounded">
                <div className="grid grid-cols-1 md:grid-cols-3">
                    <div className="grid grid-cols-3 text-center order-last md:order-first mt-20 md:mt-0">
                    <div>
                        <p className="font-bold text-gray-700 text-xl">22</p>
                        <p className="text-gray-400">Friends</p>
                    </div>
                    <div>
                        <p className="font-bold text-gray-700 text-xl">10</p>
                        <p className="text-gray-400">Photos</p>
                    </div>
                        <div>
                            <p className="font-bold text-gray-700 text-xl">89</p>
                            <p className="text-gray-400">Comments</p>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                            <CustomAvatar src={userInfo?.photoURL!} height={200} width={200} alt='' />
                        </div>
                    </div>

                      <div className="space-x-8 flex justify-between mt-32 md:mt-0 md:justify-center">
                            <ShowStatusFriend userInfo={userInfo} statusFriend={status} />
                        </div>  
                </div>

                <div className="mt-20 text-center border-b pb-12">
                    <h1 className="text-4xl font-medium text-gray-700">Jessica Jones, <span className="font-light text-gray-500">27</span></h1>
                    <p className="font-light text-gray-600 mt-3"><LocationOnIcon fontSize='small' />&nbsp;Los Angeles, California</p>

                    <p className="mt-8 text-gray-500"><MailIcon fontSize='small' />&nbsp;{userInfo?.email}</p>
                    <p className="mt-2 text-gray-500"><LocalPhoneIcon fontSize='small' />&nbsp;{parsePhoneNumber(String(userInfo?.phoneNumber))}</p>
                </div>

                <div className="mt-12 flex flex-col justify-center">
                    <p className="text-gray-600 text-center font-light lg:px-16">By the time Nikola Tesla was six years old, he had already started experimenting and inventing. His keen interest in nature and the way things work, combined with intelligence and curiosity, led to childhood inventions such as a motor powered by June bugs, air piston gun, and frog catching device. In elementary school he built water turbines and dreamed of using Niagara Falls to generate power, a dream that he saw come to life in 1896. As a young man, Tesla excelled in his studies of math, physics, engineering, and science. At one of his first jobs at the Budapest Telephone Exchange, Tesla improved the equipment and developed an amplifier; soon after, while working at another job installing lights in Paris, Tesla made improvements to Edison’s dynamos and created an automatic regulator.</p>
                    <button className="text-indigo-500 py-2 px-4  font-medium mt-4">
                        Show more
                    </button>
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