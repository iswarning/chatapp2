import { db } from '@/firebase';
import { selectAppState } from '@/redux/appSlice'
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import {useSelector} from 'react-redux'
import getRecipientEmail from '@/utils/getRecipientEmail';
import Image from 'next/image';
import { selectFriendState } from '@/redux/friendSlice';
import { UserType } from '@/types/UserType';
export default function SidebarContact() {
  
  const appState = useSelector(selectAppState)
  const friendState = useSelector(selectFriendState)
  
  return (
    <>
    <div className="side-content col-span-12 xl:col-span-3 -mt-16 xl:mt-0 pt-20 xl:-mr-6 px-6 xl:pt-6 flex-col overflow-hidden side-content--active" data-content="contacts">
<div className="intro-y text-xl font-medium">Contacts</div>
<div className="intro-y relative mt-5 mb-6">
<input type="text" className="form-control box py-3 px-4 border-transparent pr-8" placeholder="Search for contacts..."/>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search text-gray-600 w-5 h-5 absolute inset-y-0 right-0 my-auto mr-3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
</div>
<div className="intro-y overflow-y-auto scrollbar-hidden -mx-5 px-5">
<div className="user-list">
<div className="intro-x">

{
  friendState ? friendState.listFriend.map((friend) => <FriendElement key={friend.id} userInfo={friend.userInfo!} />) : null
}

</div>
</div>
</div>
</div></>
  )
}

function FriendElement({ userInfo }: { userInfo: UserType }) {

  const appState = useSelector(selectAppState)

return (
  <>
  {
      userInfo ? <div className="intro-x block mt-2">
      <div className="box dark:bg-dark-3 cursor-pointer relative flex items-center px-4 py-3">
      <div className="w-10 h-10 flex-none image-fit mr-1">
      {
          userInfo.photoURL ? <Image src={userInfo.photoURL} width={48} height={48} alt='' className="rounded-full" /> : null
      }
      {
        appState.userOnline?.find((u: any) => u === userInfo.email) ? (
          <div className="border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2" style={{background: 'green'}}></div>
          ) : (
          <span className="border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2" style={{background: 'gray'}}></span>
          )
      }
      </div>
      <div className="ml-2 overflow-hidden">
      <a href="javascript:void(0)" className="font-medium">{userInfo.fullName}</a>
      <div className="flex items-center text-xs mt-0.5">
      <div className="text-gray-600 dark:text-gray-500 truncate">{userInfo.email}</div>
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
