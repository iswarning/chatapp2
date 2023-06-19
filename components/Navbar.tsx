import { auth, db } from '@/firebase'
import { SidebarType, selectAppState, setListFriend, setSidebar } from '@/redux/appSlice'
import { MapFriendData } from '@/types/FriendType'
import { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import {useSelector,useDispatch} from 'react-redux'
export default function Navbar() {

    const appState = useSelector(selectAppState)
    const dispatch = useDispatch()
    const [user] = useAuthState(auth)

    const CLASS_ACTIVE = "-intro-x side-menu__content__link text-gray-600 dark:text-gray-300 relative tooltip py-5 side-menu__content__link--active"
    const CLASS_NOT_ACTIVE = "-intro-x side-menu__content__link text-gray-600 dark:text-gray-300 relative tooltip py-5"

    // const getListFriend = async() => {
    //     const friendSnap = await db.collection("friends").where("users",'array-contains', user?.email).get()
    //     await Promise.all(
    //         Array.prototype.map.call(friendSnap?.docs, async(snap) => {

    //         })
    //     )
    //     dispatch(setListFriend(friendSnap?.docs?.map((snap) => MapFriendData(snap))))
    // }

    // const handleShowGroupScreen = () => {
    //     getListFriend()
    //     .catch(err => console.log(err))
    //     .finally(() => dispatch(setSidebar(SidebarType.GROUPS)))
    // }

    return (
        <div className="side-menu hidden md:block top-0 left-0 fixed w-16 h-screen">
            <div className="side-menu__content box border-theme-3 dark:bg-dark-2 dark:border-dark-2 -intro-x border-r w-full h-full pt-16 flex flex-col justify-center overflow-hidden">
                
                <a href='javascript:void(0)' onClick={() => dispatch(setSidebar(SidebarType.CHAT))} className={appState.currentSidebar === SidebarType.CHAT ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} data-placement="right" data-content="chats"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail w-5 h-5 mx-auto">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg> 
                </a>
                
                <a href='javascript:void(0)' onClick={() => dispatch(setSidebar(SidebarType.GROUPS))} className={appState.currentSidebar === SidebarType.GROUPS ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} data-placement="right" data-content="groups"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit w-5 h-5 mx-auto">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg> 
                </a>

                <a href='javascript:void(0)' onClick={() => dispatch(setSidebar(SidebarType.CONTACTS))} className={appState.currentSidebar === SidebarType.CONTACTS ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} data-placement="right" data-content="contacts"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users w-5 h-5 mx-auto">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg> 
                </a>

                <a href='javascript:void(0)' onClick={() => dispatch(setSidebar(SidebarType.PROFILE))} className={appState.currentSidebar === SidebarType.PROFILE ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} data-placement="right" data-content="profile"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user w-5 h-5 mx-auto">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg> 
                </a>

            </div>
        </div>
    )
}