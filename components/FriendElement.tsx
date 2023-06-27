import { db } from '@/firebase'
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import Image from 'next/image'
import {useSelector} from 'react-redux'
import { selectAppState } from '@/redux/appSlice'
import { MapUserData, UserType } from '@/types/UserType'

export default function FriendElement({ email }: { email: string }) {

    const [userInfo] = useCollection(
        db
        .collection("users")
        .where("email",'==',email)
        .limit(1)
    )

    const appState = useSelector(selectAppState)

  return (
    <>
    {
        userInfo ? <div className="intro-x block mt-2">
        <div className="box dark:bg-dark-3 cursor-pointer relative flex items-center px-4 py-3 zoom-in ">
        <div className="w-10 h-10 flex-none image-fit mr-1">
        {
            userInfo.docs?.[0].data()?.photoURL ? <Image src={userInfo.docs?.[0].data().photoURL} width={48} height={48} alt='' className="rounded-full" /> : null
        }
        <div className="bg-green-500 border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2"></div>
        </div>
        <div className="ml-2 overflow-hidden">
        <a href="javascript:void(0)" className="font-medium">{userInfo.docs?.[0].data().fullName}</a>
        <div className="flex items-center text-xs mt-0.5">
        <div className="text-gray-600 dark:text-gray-500 truncate">{userInfo.docs?.[0].data().email}</div>
        </div>
        </div>
        <div className="dropdown absolute flex items-center top-0 bottom-0 right-0 mr-4 ml-auto">
        <a className="dropdown-toggle w-4 h-4" href="javascript:void(0)" aria-expanded="false"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </a>
        <div className="dropdown-menu w-40">
        <div className="dropdown-menu__content box dark:bg-dark-1 p-2">
        <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share-2 w-4 h-4 mr-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> Share Contact </a>
        <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-copy w-4 h-4 mr-2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg> Copy Contact </a>
        </div>
        </div>
        </div>
        </div>
        </div> : null
    }
    </>
    
  )
}
