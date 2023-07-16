import React from 'react'
import styled from 'styled-components'
import Image from 'next/image';
import { FriendRequestType } from '@/types/FriendRequestType';
import { createFriend } from '@/services/FriendService';
import { FriendType } from '@/types/FriendType';
import { addNewFriend, removeFriendRequest } from '@/services/CacheService';
import {useDispatch} from 'react-redux'
import { deleteFR } from '@/services/FriendRequestService';

export default function NotificationScreen({ friendR }: { friendR: Array<FriendRequestType> }) {

  return (
    <>
        <Container className="notification-dropdown__content dropdown-menu show">
            <div className="dropdown-menu__content box dark:bg-dark-2 px-4 pt-4 pb-5">
                <div className="text-base font-medium leading-tight mb-4">Friend Requests</div>
                {
                    friendR && friendR?.length > 0 ? friendR?.map((friend: FriendRequestType) => <FriendRequestElement key={friend._id} friend={friend} />) : "No friend request !"
                }
            </div>
        </Container>
    </>
  )
}

const Container = styled.div`
    width: 350px;
    position: absolute;
    inset: 0px auto auto 0px;
    margin: 0px;
    transform: translate(1140px, 63px);
`

function FriendRequestElement({ friend }: { friend: FriendRequestType }) {

    const dispatch = useDispatch()

    const handleAccept = () => {
        createFriend({
            senderId: friend.senderId,
            recipientId: friend.recipientId,
        })
        .then((data: FriendType) => {
            addNewFriend(data, dispatch)
            removeFriendRequest(friend, dispatch)
            // push notify
        })
    }

    const handleDeny = () => {
        deleteFR(friend._id!)
        .then(() => {
            removeFriendRequest(friend, dispatch)
        })
    }

    return (
        <div className="cursor-pointer relative flex items-center mt-6 hover:bg-blue-400" onClick={() => console.log(111)}>
            <div className="w-10 h-10 flex-none image-fit mr-1">
                {
                    friend?.userInfo?.photoURL ? <Image src={friend?.userInfo?.photoURL} width={40} height={40} alt='' className='rounded-full' /> : null
                }
                <div className="w-3 h-3 absolute right-0 bottom-0 bg-theme-1 border-white rounded-full border-2"></div>
            </div>
            <div className="ml-2 overflow-hidden">
                <div className="flex items-center">
                    <a href="javascript:void(0);" className="font-medium truncate mr-5">{friend?.userInfo?.fullName}</a>
                    <div className="text-opacity-50 text-gray-800 text-xs ml-auto whitespace-nowrap -mt-0.5">01:10 PM</div>
                </div>
                <div className='mt-0.5'>
                    <BtnCustom onClick={handleAccept}>Accept</BtnCustom>
                    <BtnCustom onClick={handleDeny}>Deny</BtnCustom>
                </div>
            </div>
        </div>
    )
}
    
const BtnCustom = styled.button`
    background-color: #3A8DF5;
    color: white;
    border-radius: 5px;
    padding: 5px 10px;
    margin-right: 5px;
    &:hover{
        opacity: 0.9;
    }
`

