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
import Loading from "@/components/Loading";

function UserDetailScreen({userInfo}: any) {

    const [status, setStatus] = useState('');

    const [user] = useAuthState(auth);
    const [isShow, setShow] = useState(false);

    useEffect(() => {
        setShow(true)
        getStatusFriend(user?.email!, userInfo?.email).then((s) => {
            setStatus(s)
            setShow(false)
        }).catch(err => console.log(err))
    },[status])

    return (
        <div>
            <Loading isShow={isShow} />
            <div className="p-16 bg-white shadow rounded">
                <div className="grid grid-cols-1 md:grid-cols-3 flex">
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
                    
                    <div className="md:justify-center">
                        <ShowStatusFriend userInfo={userInfo} statusFriend={status} />
                    </div>  <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl inset-x-0 flex items-center justify-center text-indigo-500">
                        <CustomAvatar src={userInfo?.photoURL!} height={200} width={200} alt='' />
                    </div>
                </div>
                

                <div className="mt-20 text-center border-b pb-6">
                    <h1 className="text-4xl font-medium text-gray-700">Jessica Jones, <span className="font-light text-gray-500">27</span></h1>
                    <p className="font-light text-gray-600 mt-3"><LocationOnIcon fontSize='small' />&nbsp;Los Angeles, California</p>

                    <p className="mt-8 text-gray-500"><MailIcon fontSize='small' />&nbsp;{userInfo?.email}</p>
                    <p className="mt-2 text-gray-500"><LocalPhoneIcon fontSize='small' />&nbsp;{parsePhoneNumber(String(userInfo?.phoneNumber))}</p>
                </div>

                <div className="mt-12 flex flex-col justify-center">
                    <p className="text-gray-600 text-center font-light lg:px-16">By the time Nikola Tesla was six years old, he had already started experimenting and inventing. His keen interest in nature and the way things work, combined with intelligence and curiosity, led to childhood inventions such as a motor powered by June bugs, air piston gun, and frog catching device.</p>
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
        return phone.slice(0, 4) + '.' + phone.slice(4, 7) + '.' + phone.slice(7, 10)
    }
}
export default UserDetailScreen