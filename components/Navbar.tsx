import { auth } from "@/firebase";
import { faAddressCard, faComment, faFileAlt, faUserCheck, faUserGroup, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ChatIcon from '@mui/icons-material/Chat';
import { useAuthState } from "react-firebase-hooks/auth";
import { CustomAvatar } from "./Chat";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";

export default function Navbar() {

    const [user] = useAuthState(auth);
    const router = useRouter();

    const CLASS_ACTIVE = "block py-4 px-12 border-l-4 border-gray-800 bg-gray-300 text-black hover:bg-gray-300 hover:text-black cursor-pointer"
    const CLASS_NOT_ACTIVE = "block py-4 px-12 border-l-4 text-gray-600 hover:bg-gray-300 hover:text-black cursor-pointer"

    return (
        <div className="hidden xl:block sm:flex-2 w-64 bg-gray-200">
            <div className="user-profile text-center">
                <div className="w-32 h-32 rounded-full  border-2 border-white bg-white shadow-lg" style={{ margin: '4rem auto 2rem auto' }}>
                    <CustomAvatar
                        src={user?.photoURL!}
                        width={130}
                        height={130}
                        alt="User Avatar"
                        className="block"
                    />
                </div>
                 <div className="text-gray-800 mt-8">
                    {user?.displayName}
                    <span className="inline-block align-text-bottom">
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M19 9l-7 7-7-7"></path></svg>
                    </span>
                </div>
            </div>
            <div className="menu mt-8">
                <Link className={router.pathname === "/" || router.pathname.indexOf("chat") !== -1 ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} href={'/'}>
                    <span className="inline-block align-text-bottom mr-2">
                        <FontAwesomeIcon icon={faComment} fontSize={12} />
                    </span>
                    Chat
                </Link>
                <Link className={router.pathname === "/friend-requests" ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} href={'/friend-requests'}>
                    <span className="inline-block align-text-bottom mr-2">
                        <FontAwesomeIcon icon={faUserPlus} fontSize={12} />
                    </span>
                    Friend Requests
                </Link>

                <Link className={router.pathname === "/all-friends" ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} href={'/all-friends'}>
                    <span className="inline-block align-text-bottom mr-2">
                        <FontAwesomeIcon icon={faUserCheck} fontSize={12} />
                    </span>
                    All friends
                </Link>
                <Link className={router.pathname === "/suggestions" ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} href={'/suggestions'}>
                    <span className="inline-block align-text-bottom mr-2">
                        <FontAwesomeIcon icon={faUserGroup} fontSize={12} />
                    </span>
                    Suggestions
                </Link>
                <Link className={router.pathname === "/files" ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} href={'/files'}>
                    <span className="inline-block align-text-bottom mr-2">
                        <FontAwesomeIcon icon={faFileAlt} fontSize={12} />
                    </span>&nbsp;
                    Files
                </Link>
                <Link className={router.pathname === "/profile" ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} href={'/profile'}>
                    <span className="inline-block align-text-bottom mr-2">
                        <FontAwesomeIcon icon={faAddressCard} fontSize={12} />
                    </span>
                    Profile
                </Link>                
                
            </div>
        </div>
    )
}