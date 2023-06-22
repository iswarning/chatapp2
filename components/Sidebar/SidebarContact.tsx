import { db } from '@/firebase';
import { selectAppState } from '@/redux/appSlice'
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';
import {useSelector} from 'react-redux'
import FriendElement from '../FriendElement';
import getRecipientEmail from '@/utils/getRecipientEmail';

export default function SidebarContact() {
  
  const appState = useSelector(selectAppState)

  const [friendSnapshot] = useCollection(
    db.collection("friends").where("users", "array-contains", appState.userInfo?.email)
  );
  
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
  friendSnapshot ? friendSnapshot.docs.map((friend) => <FriendElement key={friend.id} email={getRecipientEmail(friend.data().users, { email: appState.userInfo.email })} />) : null
}

</div>
</div>
</div>
</div></>
  )
}
