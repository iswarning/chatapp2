
import { selectAppState } from '@/redux/appSlice'
import React from 'react'
import {useSelector,useDispatch} from 'react-redux'
import Image from 'next/image';
import { selectFriendState } from '@/redux/friendSlice';
import { UserType } from '@/types/UserType';
import CancelIcon from '@mui/icons-material/Cancel';
import { removeFriendGlobal } from '@/services/CacheService';
import { removeFriend } from '@/services/FriendService';
import { FriendType } from '@/types/FriendType';
import styled from 'styled-components';

export default function SidebarContact() {
  
  
  const friendState = useSelector(selectFriendState)
  
  return (
    <>
    <div className="side-content col-span-12 xl:col-span-3 -mt-16 xl:mt-0 pt-20 xl:-mr-6 px-6 xl:pt-6 flex-col overflow-hidden side-content--active" data-content="contacts">
<div className="text-xl font-medium">Contacts</div>
<div className="relative mt-5 mb-6">
<input type="text" className="form-control box py-3 px-4 border-transparent pr-8" placeholder="Search for contacts..."/>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search text-gray-600 w-5 h-5 absolute inset-y-0 right-0 my-auto mr-3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
</div>
<div className="overflow-y-auto scrollbar-hidden -mx-5 px-5">
<div className="user-list">
<div>

{
  friendState ? friendState.listFriend.map((friend) => <FriendElement key={friend._id} friendId={friend._id} userInfo={friend.userInfo!} />) : null
}

</div>
</div>
</div>
</div></>
  )
}

function FriendElement({ friendId, userInfo }: { friendId: string | undefined, userInfo: UserType }) {

  const appState = useSelector(selectAppState)
  const dispatch = useDispatch()

  const handleUnfriend = (event: any) => {
    event.preventDefault()
    if(!confirm("Do you want to unfriend ?")) return
    removeFriend(friendId!)
    .then(() => {
      removeFriendGlobal(friendId!, dispatch)
    })
  }

return (
  <>
  {
      userInfo ? <div className="block mt-2">
        <div className="box dark:bg-dark-3 relative flex items-center px-4 py-3">
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
          <div className="dropdown relative flex items-center top-0 bottom-0 right-0 mr-4 ml-auto">
            <ButtonUnfriend onClick={handleUnfriend} className="dropdown-toggle w-4 h-4"> 
              <CancelIcon fontSize='small' /> 
            </ButtonUnfriend>
          </div>
        </div>
      </div> : null
  }
  </>
  
)
}

const ButtonUnfriend = styled.button`
  &:focus {
    outline: none;
  }
`
