
import { selectAppState } from '@/redux/appSlice'
import React, { useState } from 'react'
import {useSelector,useDispatch} from 'react-redux'
import Image from 'next/image';
import { UserType } from '@/types/UserType';
import styled from 'styled-components';
import DoneIcon from '@mui/icons-material/Done';
import ClearIcon from '@mui/icons-material/Clear';
import { selectFriendRequestState } from '@/redux/friendRequestSlice';
import { createFriend } from '@/services/FriendService';
import { FriendRequestType } from '@/types/FriendRequestType';
import { FriendType } from '@/types/FriendType';
import { addNewFriend, addNewFriendRequest, removeFriendRequestGlobal } from '@/services/CacheService';
import { createFriendRequest, deleteFR } from '@/services/FriendRequestService';
import { findAllUser, pushNotify } from '@/services/UserService';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import { selectFriendState } from '@/redux/friendSlice';

export default function SidebarFriendRequest() {
  
  
  const friendRequestState = useSelector(selectFriendRequestState)
  const friendState = useSelector(selectFriendState)
  const [input, setInput] = useState("")
  const appState = useSelector(selectAppState)
  const [result, setResult] = useState<UserType[]>([])

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    findAllUser()
    .then((data: UserType[]) => {
      setResult(
        data.filter((user) => (friendState.listFriend.find((fR) => fR.senderId !== user._id && fR.recipientId !== user._id ) ||
        friendRequestState.listFriendRequest.find((fR) => fR.senderId !== user._id && fR.recipientId !== user._id )) && user.email.includes(input) )
      )
    })
  }  
  
  return (
    <>
    <div className="side-content col-span-12 xl:col-span-3 -mt-16 xl:mt-0 pt-20 xl:-mr-6 px-6 xl:pt-6 flex-col overflow-hidden side-content--active" data-content="contacts">
      <div className="text-xl font-medium">Friend Requests</div>
      <div className="relative mt-5 mb-6">
        <form onSubmit={onFormSubmit}>
          <input type="text" className="form-control box py-3 px-4 border-transparent pr-8" placeholder="Search user..." value={input} onChange={(e) => setInput(e.target.value)}/>
          <button type="submit">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search text-gray-600 w-5 h-5 absolute inset-y-0 right-0 my-auto mr-3">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </form>
      </div>
      <div className="overflow-y-auto scrollbar-hidden -mx-5 px-5">
        <div className="user-list">
          <div>

          {
            friendRequestState && input.length === 0 ? friendRequestState.listFriendRequest.map((fR, index) => <FriendElement key={fR._id} fR={fR} index={index} />) : null
          }

          {
            input.length > 0 && result.length > 0 ? result.map((info, index) => <UserElement key={info._id} userInfo={info} resetInput={() => setInput("")} index={index} />)  : null
          }

          </div>
        </div>
      </div>
</div></>
  )
}

function UserElement({ userInfo, resetInput, index }: { userInfo: UserType | null, resetInput: any, index: number }) {

  const appState = useSelector(selectAppState)
  const dispatch = useDispatch()

  const handleAddFriend = (event: any) => {
    event.preventDefault()
    createFriendRequest({
      senderId: appState.userInfo._id!,
      recipientId: userInfo?._id!
    })
    .then((data: FriendRequestType) => {
      addNewFriendRequest(data, dispatch)
      resetInput()
      pushNotify({
        senderId: appState.userInfo._id!,
        recipientId: data.senderId === appState.userInfo._id ? data.recipientId : data.senderId,
        type: "send-friend-request",
        message: `${appState.userInfo.fullName} send a friend request`,
        dataNotify: {
          friend: data
        }
      })
    })
  }

  return (
    <>
      <div className="block mt-2">
        <div className="box dark:bg-dark-3 relative flex items-center px-4 py-3">
          <div className="w-10 h-10 flex-none image-fit mr-1">
          {
              userInfo?.photoURL ? <Image src={userInfo?.photoURL} width={48} height={48} alt='' className="rounded-full" /> : null
          }
          </div>
          <div className="ml-2 overflow-hidden">
            <a href="javascript:void(0)" className="font-medium">{userInfo?.fullName}</a>
            <div className="flex items-center text-xs mt-0.5">
              <div className="text-gray-600 dark:text-gray-500 truncate">{userInfo?.email}</div>
            </div>
          </div>
          <div className="dropdown relative flex items-center top-0 bottom-0 right-0 mr-4 ml-auto">
            <Btn onClick={handleAddFriend} className="dropdown-toggle w-4 h-4"> 
              <PersonAddAltOutlinedIcon fontSize='small' />
            </Btn>
          </div>
        </div>
      </div>
    </>
  )
}

function FriendElement({ fR, index }: { fR: FriendRequestType, index: number }) {

  const appState = useSelector(selectAppState)
  const dispatch = useDispatch()

  const handleAddFriend = (event: any) => {
    event.preventDefault()
    createFriend({
      senderId: appState.userInfo._id!,
      recipientId: fR.senderId
    })
    .then((data: FriendType) => {
      addNewFriend(data, dispatch)
      removeFriendRequestGlobal(index, dispatch)
      pushNotify({
        senderId: appState.userInfo._id!,
        recipientId: fR.senderId === appState.userInfo._id ? fR.recipientId : fR.senderId,
        type: "accept-friend-request",
        message: `${appState.userInfo.fullName} accepted a friend request`,
        dataNotify: {
          friend: data
        }
      })
    })
  }

  const handleRemove = (event: any) => {
    event.preventDefault()
    deleteFR(fR._id!)
    pushNotify({
      senderId: appState.userInfo._id!,
      recipientId: fR.senderId === appState.userInfo._id ? fR.recipientId : fR.senderId,
      type: "remove-friend-request",
      message: fR._id,
    })
  }

return (
  <>
  {
      fR.userInfo ? <div className="block mt-2">
        <div className="box dark:bg-dark-3 relative flex items-center px-4 py-3">
          <div className="w-10 h-10 flex-none image-fit mr-1">
          {
              fR.userInfo.photoURL ? <Image src={fR.userInfo.photoURL} width={48} height={48} alt='' className="rounded-full" /> : null
          }
          {
            appState.userOnline?.find((u: any) => u === fR.userInfo?.email) ? (
              <div className="border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2" style={{background: 'green'}}></div>
              ) : (
              <span className="border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2" style={{background: 'gray'}}></span>
              )
          }
          </div>
          <div className="ml-2 overflow-hidden">
            <a href="javascript:void(0)" className="font-medium">{fR.userInfo.fullName}</a>
            <div className="flex items-center text-xs mt-0.5">
              <div className="text-gray-600 dark:text-gray-500 truncate">{fR.userInfo.email}</div>
            </div>
          </div>
          <div className="dropdown relative flex items-center top-0 bottom-0 right-0 mr-4 ml-auto">
            <Btn onClick={handleAddFriend} className="dropdown-toggle w-4 h-4"> 
              <DoneIcon fontSize='small' />
            </Btn>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Btn onClick={handleRemove} className="dropdown-toggle w-4 h-4"> 
             <ClearIcon fontSize='small' />
            </Btn>
          </div>
        </div>
      </div> : null
  }
  </>
  
)
}

const Btn = styled.button`
  &:focus {
    outline: none;
  }
`
