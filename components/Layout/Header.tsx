import styled from "styled-components";
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Image from "next/image";
import NotificationScreen from "../NotificationScreen";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { selectFriendRequestState } from "@/redux/friendRequestSlice";

export default function Header() {

    const [user] = useAuthState(auth);
    const [show, setShow] = useState(false)
    const friendRequestState = useSelector(selectFriendRequestState)

    // const [friendR] = useCollection(
    //     db
    //     .collection("friend_requests")
    //     .where("recipientEmail", '==', user?.email)
    // )
    
    return (
<>
        <div className="top-bar top-0 left-0 fixed w-full h-16">
        <div className="-intro-y top-bar__content bg-white border-theme-3 dark:bg-dark-2 dark:border-dark-2 border-b w-full h-full flex px-5">
        <a className="hidden md:flex items-center h-full mr-auto" href="http://localhost/page/dashboard">
        <img alt="Topson Messenger Tailwind HTML Admin Template" className="h-8" src="https://topson.left4code.com/dist/images/logo.svg"/>
        <div className="text-base font-light ml-4"> <span className="font-medium">Clone</span> Messenger </div>
        </a>
        <a className="mobile-menu-toggler flex md:hidden items-center h-full mr-auto px-5 -ml-5" href="javascript:void(0)"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart-2 w-5 h-5 transform rotate-90"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg> </a>
        <div className="h-full flex items-center">
        <div className="mr-3">Dark Mode</div>
        <input className="form-check-switch" type="checkbox" id="dark-mode-switcher" onChange={(event) => { if(event.currentTarget.checked) document.documentElement.classList.add("dark"); else document.documentElement.classList.remove("dark") }}/>
        </div>
        <div className="hidden md:flex items-center px-5"></div>
        <div className="notification-dropdown dropdown">
            <a onClick={() => setShow(!show)} href="javascript:void(0)" className="notification-dropdown__toggler text-gray-600 border-theme-7 dark:border-dark-4 dark:text-gray-300 dropdown-toggle h-full flex items-center px-5 relative -mr-3 md:mr-0 md:border-l md:border-r">
                <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell w-5 h-5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                    {
                        friendRequestState.listFriendRequest && friendRequestState.listFriendRequest.length > 0 ? <div className="w-2 h-2 bg-theme-1 text-white flex items-center justify-center absolute -mt-0.5 top-0 right-0 rounded-full"></div> : null
                    }
                </div>
            </a>
        </div>
        <div className="account-dropdown dropdown relative">
        <a href="javascript:void(0)" className="h-full dropdown-toggle flex items-center pl-5">
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
        { show ? <NotificationScreen friendR={friendRequestState.listFriendRequest} /> : null }
        </>
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