import { IconButton, Modal } from "@mui/material";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useEffect, useState } from "react";
import CreateGroupScreen from "./CreateGroupScreen/CreateGroupScreen";
import styled from "styled-components";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "@/utils/getRecipientEmail";
import Image from "next/image";

export default function Header() {
    
    const [isOpen, setIsOpen] = useState(false);
    const [user] = useAuthState(auth);
    const [friendList, setFriendList]: any = useState([]);

    useEffect(() => {
        
    },[])

    // const [friendSnapshot] = useCollection(
    //     db
    //     .collection("friends")
    //     .where("users",'array-contains',user?.email)
    // )

    // async function getFriendList() {
    //     let result: any[] = [];

    //     friendSnapshot?.docs?.forEach(async(friend) => {
    //         const userSnapshot = await db.collection("users").where("email",'==',getRecipientEmail(friend.data().users, user)).get()
    //         const userInfo = userSnapshot?.docs?.[0];
    //         result.push({
    //             friendId: friend.id,
    //             ...friend.data(),
    //             userId: userInfo.id,
    //             ...userInfo.data()
    //         })
             
    //     })
        
    //     return result;
    // }
    
    return (
        // <div className="py-4 flex-2 flex flex-row">
        //     <div className="flex-1">
        //         <span className="xl:hidden inline-block text-gray-700 hover:text-gray-900 align-bottom">
        //             <span className="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
        //                 <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
        //             </span>
        //         </span>
        //         <span className="lg:hidden inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom">
        //             <span className="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
        //                 <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        //             </span>
        //         </span>
        //     </div>
        //     <div className="flex-1 text-right">
        //         <span className="inline-block text-gray-700">
        //             <IconButton onClick={() => setIsOpen(true)}>
        //                 <GroupAddIcon titleAccess='Create Group Chat'/>
        //             </IconButton>
        //         </span>
        //     </div>
        //     <Modal open={isOpen} onClose={() => setIsOpen(false)} >
        //         <ModalContainer>
        //             <h3 className="text-center">Create New Group Chat</h3>
        //             <CreateGroupScreen onClose={() => setIsOpen(false)} />
        //         </ModalContainer>
        //     </Modal>
        // </div>
        <div className="top-bar top-0 left-0 fixed w-full h-16">
        <div className="-intro-y top-bar__content bg-white border-theme-3 dark:bg-dark-2 dark:border-dark-2 border-b w-full h-full flex px-5">
        <a className="hidden md:flex items-center h-full mr-auto" href="http://localhost/page/dashboard">
        <img alt="Topson Messenger Tailwind HTML Admin Template" className="h-8" src="https://topson.left4code.com/dist/images/logo.svg"/>
        <div className="text-base font-light ml-4"> <span className="font-medium">Clone</span> Messenger </div>
        </a>
        <a className="mobile-menu-toggler flex md:hidden items-center h-full mr-auto px-5 -ml-5" href="javascript:;"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart-2 w-5 h-5 transform rotate-90"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> </a>
        <div className="h-full flex items-center">
        <div className="mr-3">Dark Mode</div>
        <input className="form-check-switch" type="checkbox" id="dark-mode-switcher"/>
        </div>
        <div className="hidden md:flex items-center px-5"></div>
        <div className="notification-dropdown dropdown">
        <a href="javascript:;" className="notification-dropdown__toggler text-gray-600 border-theme-7 dark:border-dark-4 dark:text-gray-300 dropdown-toggle h-full flex items-center px-5 relative -mr-3 md:mr-0 md:border-l md:border-r">
        <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell w-5 h-5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        <div className="w-2 h-2 bg-theme-1 text-white flex items-center justify-center absolute -mt-0.5 top-0 right-0 rounded-full"></div>
        </div>
        </a>
        <div className="notification-dropdown__content dropdown-menu">
        <div className="dropdown-menu__content box dark:bg-dark-2 px-4 pt-4 pb-5">
        <div className="text-base font-medium leading-tight mb-4">Notifications</div>
        <div className="cursor-pointer relative flex items-center ">
        <div className="w-10 h-10 flex-none image-fit mr-1">
        <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-full" src="https://topson.left4code.com/dist/images/profile-1.jpg"/>
        <div className="w-3 h-3 absolute right-0 bottom-0 bg-theme-1 border-white rounded-full border-2"></div>
        </div>
        <div className="ml-2 overflow-hidden">
        <div className="flex items-center">
        <a href="javascript:;" className="font-medium truncate mr-5">Keanu Reeves</a>
        <div className="text-opacity-50 text-gray-800 text-xs ml-auto whitespace-nowrap -mt-0.5">05:09 AM</div>
        </div>
        <div className="text-opacity-70 text-gray-800 dark:text-gray-500 w-full truncate mt-0.5">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomi</div>
        </div>
        </div>
        <div className="cursor-pointer relative flex items-center mt-6">
        <div className="w-10 h-10 flex-none image-fit mr-1">
        <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-full" src="https://topson.left4code.com/dist/images/profile-10.jpg"/>
        <div className="w-3 h-3 absolute right-0 bottom-0 bg-theme-1 border-white rounded-full border-2"></div>
        </div>
        <div className="ml-2 overflow-hidden">
        <div className="flex items-center">
        <a href="javascript:;" className="font-medium truncate mr-5">Leonardo DiCaprio</a>
        <div className="text-opacity-50 text-gray-800 text-xs ml-auto whitespace-nowrap -mt-0.5">01:10 PM</div>
        </div>
        <div className="text-opacity-70 text-gray-800 dark:text-gray-500 w-full truncate mt-0.5">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem </div>
        </div>
        </div>
        <div className="cursor-pointer relative flex items-center mt-6">
        <div className="w-10 h-10 flex-none image-fit mr-1">
        <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-full" src="https://topson.left4code.com/dist/images/profile-14.jpg"/>
        <div className="w-3 h-3 absolute right-0 bottom-0 bg-theme-1 border-white rounded-full border-2"></div>
        </div>
        <div className="ml-2 overflow-hidden">
        <div className="flex items-center">
        <a href="javascript:;" className="font-medium truncate mr-5">Christian Bale</a>
        <div className="text-opacity-50 text-gray-800 text-xs ml-auto whitespace-nowrap -mt-0.5">05:09 AM</div>
        </div>
        <div className="text-opacity-70 text-gray-800 dark:text-gray-500 w-full truncate mt-0.5">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem </div>
        </div>
        </div>
        <div className="cursor-pointer relative flex items-center mt-6">
        <div className="w-10 h-10 flex-none image-fit mr-1">
        <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-full" src="https://topson.left4code.com/dist/images/profile-4.jpg"/>
        <div className="w-3 h-3 absolute right-0 bottom-0 bg-theme-1 border-white rounded-full border-2"></div>
        </div>
        <div className="ml-2 overflow-hidden">
        <div className="flex items-center">
        <a href="javascript:;" className="font-medium truncate mr-5">Kevin Spacey</a>
        <div className="text-opacity-50 text-gray-800 text-xs ml-auto whitespace-nowrap -mt-0.5">06:05 AM</div>
        </div>
        <div className="text-opacity-70 text-gray-800 dark:text-gray-500 w-full truncate mt-0.5">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomi</div>
        </div>
        </div>
        <div className="cursor-pointer relative flex items-center mt-6">
        <div className="w-10 h-10 flex-none image-fit mr-1">
        <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-full" src="https://topson.left4code.com/dist/images/profile-13.jpg"/>
        <div className="w-3 h-3 absolute right-0 bottom-0 bg-theme-1 border-white rounded-full border-2"></div>
        </div>
        <div className="ml-2 overflow-hidden">
        <div className="flex items-center">
        <a href="javascript:;" className="font-medium truncate mr-5">Tom Hanks</a>
        <div className="text-opacity-50 text-gray-800 text-xs ml-auto whitespace-nowrap -mt-0.5">05:09 AM</div>
        </div>
        <div className="text-opacity-70 text-gray-800 dark:text-gray-500 w-full truncate mt-0.5">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomi</div>
        </div>
        </div>
        </div>
        </div>
        </div>
        <div className="account-dropdown dropdown relative">
        <a href="javascript:;" className="h-full dropdown-toggle flex items-center pl-5">
        <div className="w-8 h-8 image-fit">
        {
            user?.photoURL ? <Image 
                src={user?.photoURL!}
                width={48}
                height={48}
                alt=""
                className="rounded-full"
            /> : null
        }
        </div>
        <div className="hidden md:block ml-3">
        <div className="w-28 truncate font-medium leading-tight">{user?.displayName}</div>
        <div className="account-dropdown__info text-xs text-gray-600">{user?.email}</div>
        </div>
        </a>
        <div className="dropdown-content dropdown-menu absolute w-56 top-0 right-0 z-20">
        <div className="dropdown-menu__content box dark:bg-dark-2">
        <div className="p-2">
        <a href="" className="flex items-center block p-2 transition duration-300 ease-in-out rounded-md hover:bg-gray-200 dark:hover:bg-dark-3"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user w-4 h-4 mr-2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Profile </a>
        <a href="" className="flex items-center block p-2 transition duration-300 ease-in-out rounded-md hover:bg-gray-200 dark:hover:bg-dark-3"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit w-4 h-4 mr-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg> Add Account </a>
        <a href="" className="flex items-center block p-2 transition duration-300 ease-in-out rounded-md hover:bg-gray-200 dark:hover:bg-dark-3"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-lock w-4 h-4 mr-2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> Reset Password </a>
        <a href="" className="flex items-center block p-2 transition duration-300 ease-in-out rounded-md hover:bg-gray-200 dark:hover:bg-dark-3"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-help-circle w-4 h-4 mr-2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg> Help </a>
        </div>
        <div className="border-gray-200 dark:border-dark-4 p-2 border-t">
        <a href="" className="flex items-center block p-2 transition duration-300 ease-in-out rounded-md hover:bg-gray-200 dark:hover:bg-dark-3"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-toggle-right w-4 h-4 mr-2"><rect x="1" y="5" width="22" height="14" rx="7" ry="7"></rect><circle cx="16" cy="12" r="3"></circle></svg> Logout </a>
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
    );
}

const ModalContainer = styled.article`
    width: 400px;
    height: 700px;
    background: white;
    margin-left: auto;
    margin-right: auto;
    margin-top: 60px;
    border-radius: 10px;
    padding: 30px;
`