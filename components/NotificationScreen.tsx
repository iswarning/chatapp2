import React from 'react'
import styled from 'styled-components'
import AddTaskIcon from '@mui/icons-material/AddTask';
import CloseIcon from '@mui/icons-material/Close';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '@/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Image from 'next/image';
import { FriendRequestType } from '@/types/FriendRequestType';

export default function NotificationScreen({ friendR }: { friendR: Array<FriendRequestType> }) {

    const [user] = useAuthState(auth)

  return (
    <>
        <Container className="notification-dropdown__content dropdown-menu show">
            <div className="dropdown-menu__content box dark:bg-dark-2 px-4 pt-4 pb-5">
                <div className="text-base font-medium leading-tight mb-4">Friend Requests</div>
                {
                    friendR && friendR?.length > 0 ? friendR?.map((friend: FriendRequestType) => <FriendRequestElement key={friend.id} friend={friend} />) : "No friend request !"
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

    // const [userInfo] = useCollection(
    //     db
    //     .collection("users")
    //     .where("email",'==', friend.senderEmail)
    //     .limit(1)
    // )

    return (
        <div className="cursor-pointer relative flex items-center mt-6">
            <div className="w-10 h-10 flex-none image-fit mr-1">
                {
                    friend?.userInfo?.photoURL ? <Image src={friend?.userInfo?.photoURL} width={40} height={40} alt='' /> : null
                }
                <div className="w-3 h-3 absolute right-0 bottom-0 bg-theme-1 border-white rounded-full border-2"></div>
            </div>
            <div className="ml-2 overflow-hidden">
                <div className="flex items-center">
                    <a href="javascript:;" className="font-medium truncate mr-5">{friend?.userInfo?.fullName}</a>
                    <div className="text-opacity-50 text-gray-800 text-xs ml-auto whitespace-nowrap -mt-0.5">01:10 PM</div>
                </div>
                <div className='mt-0.5 '>
                    <AddTaskIcon fontSize='small' />&nbsp;
                    <CloseIcon fontSize='small' />
                </div>
            </div>
        </div>
    )
}
    


