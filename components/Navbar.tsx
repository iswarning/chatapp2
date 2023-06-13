import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { CustomAvatar } from "./ChatPage/ChatComponent";
import { useRouter } from "next/router";
import Link from "next/link";
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleIcon from '@mui/icons-material/People';
import ReorderIcon from '@mui/icons-material/Reorder';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

export default function Navbar() {

    const [user] = useAuthState(auth);
    const router = useRouter();

    const CLASS_ACTIVE = "block py-4 px-12 border-l-4 border-gray-800 bg-gray-300 text-black hover:bg-gray-300 hover:text-black cursor-pointer"
    const CLASS_NOT_ACTIVE = "block py-4 px-12 border-l-4 text-gray-600 hover:bg-gray-300 hover:text-black cursor-pointer"

    return (
        // <div className="hidden xl:block sm:flex-2 w-64 bg-gray-200 h-screen position-fixed">
        //     <div className="user-profile text-center">
        //         <div className="w-32 h-32 rounded-full  border-2 border-white bg-white shadow-lg" style={{ margin: '4rem auto 2rem auto' }}>
        //             <CustomAvatar
        //                 src={user?.photoURL!}
        //                 width={130}
        //                 height={130}
        //                 alt="User Avatar"
        //                 className="block"
        //             />
        //         </div>
        //          <div className="text-gray-800 mt-8">
        //             {user?.displayName}
        //             <span className="inline-block align-text-bottom">
        //                 <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4"><path d="M19 9l-7 7-7-7"></path></svg>
        //             </span>
        //         </div>
        //     </div>
        //     <div className="menu mt-8">
        //         <Link className={router.pathname === "/" || router.pathname.indexOf("chat") !== -1 ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} href={'/'}>
        //             <span className="inline-block align-text-bottom mr-2">
        //                 <QuestionAnswerIcon fontSize="small" />
        //             </span>
        //             Chat
        //         </Link>
        //         <Link className={router.pathname === "/friend-requests" ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} href={'/friend-requests'}>
        //             <span className="inline-block align-text-bottom mr-2">
        //                 <PersonAddIcon fontSize="small" />
        //             </span>
        //             Friend Requests
        //         </Link>
        //         <Link className={router.pathname === "/all-friends" ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} href={'/all-friends'}>
        //             <span className="inline-block align-text-bottom mr-2">
        //                 <ReorderIcon fontSize="small"  />
        //             </span>
        //             All friends
        //         </Link>
        //         <Link className={router.pathname === "/suggestions" ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} href={'/suggestions'}>
        //             <span className="inline-block align-text-bottom mr-2">
        //                 <PeopleIcon fontSize="small" />
        //             </span>
        //             Suggestions
        //         </Link>
        //         <Link className={router.pathname === "/profile" || router.pathname.indexOf("profile") !== -1 ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} href={'/profile'}>
        //             <span className="inline-block align-text-bottom mr-2">
        //                 <AccountCircleIcon fontSize="small" />
        //             </span>
        //             Profile
        //         </Link>                
        //         <div className={CLASS_NOT_ACTIVE} onClick={() => auth.signOut()}>
        //             <span className="inline-block align-text-bottom mr-2">
        //                 <LogoutIcon fontSize="small" />
        //             </span>
        //             Logout
        //         </div>   
        //     </div>
        // </div>
        <div className="side-menu hidden md:block top-0 left-0 fixed w-16 h-screen">
<div className="side-menu__content box border-theme-3 dark:bg-dark-2 dark:border-dark-2 -intro-x border-r w-full h-full pt-16 flex flex-col justify-center overflow-hidden">
<a className="-intro-x side-menu__content__link text-gray-600 dark:text-gray-300 relative side-menu__content__link--active tooltip py-5" href="javascript:;.html" data-placement="right" data-content="chats"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-mail w-5 h-5 mx-auto"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> </a>
<a className="-intro-x side-menu__content__link text-gray-600 dark:text-gray-300 relative tooltip py-5" href="javascript:;.html" data-placement="right" data-content="groups"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-edit w-5 h-5 mx-auto"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> </a>
<a className="-intro-x side-menu__content__link text-gray-600 dark:text-gray-300 relative tooltip py-5" href="javascript:;.html" data-placement="right" data-content="contacts"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-users w-5 h-5 mx-auto"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> </a>
<a className="-intro-x side-menu__content__link text-gray-600 dark:text-gray-300 relative tooltip py-5" href="javascript:;.html" data-placement="right" data-content="profile"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-user w-5 h-5 mx-auto"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> </a>
<a className="-intro-x side-menu__content__link text-gray-600 dark:text-gray-300 relative tooltip py-5" href="login.html" data-placement="right"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-lock w-5 h-5 mx-auto"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> </a>
<a className="-intro-x side-menu__content__link text-gray-600 dark:text-gray-300 relative tooltip py-5" href="register.html" data-placement="right"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-user-plus w-5 h-5 mx-auto"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg> </a>
<a className="-intro-x side-menu__content__link text-gray-600 dark:text-gray-300 relative tooltip py-5" href="settings.html" data-placement="right"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-settings w-5 h-5 mx-auto"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg> </a>
</div>
</div>
    )
}