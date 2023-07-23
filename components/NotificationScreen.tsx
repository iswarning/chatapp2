import React from 'react'
import styled from 'styled-components'
import Image from 'next/image';
import { FriendRequestType } from '@/types/FriendRequestType';
import { createFriend } from '@/services/FriendService';
import { FriendType } from '@/types/FriendType';
import { addNewFriend, removeFriendRequestGlobal } from '@/services/CacheService';
import {useDispatch} from 'react-redux'
import { deleteFR } from '@/services/FriendRequestService';

export default function NotificationScreen({ friendR }: { friendR: Array<FriendRequestType> }) {

  return (
    <>
        <Container>
            <BoxItem>
                <Title>Friend Requests</Title>
                {/* {
                    friendR && friendR?.length > 0 ? friendR?.map((friend: FriendRequestType) => <FriendRequestElement key={friend._id} friend={friend} />) : "No friend request !"
                } */}
                <div className='flex'>
                    <div>
                        
                        <div></div>
                    </div>
                    <div className='flex'>
                        <div>
                            <button className="">aerwarwarawr</button>
                            <small className="">01:10 PM</small>
                        </div>
                        <div className='flex-column'>
                            <BtnCustom>Accept</BtnCustom>
                            <BtnCustom>Deny</BtnCustom>
                        </div>
                    </div>
                </div>
            </BoxItem>
        </Container>
    </>
  )
}

function FriendRequestElement({ friend }: { friend: FriendRequestType }) {

    const dispatch = useDispatch()

    const handleAccept = () => {
        createFriend({
            senderId: friend.senderId,
            recipientId: friend.recipientId,
        })
        .then((data: FriendType) => {
            addNewFriend(data, dispatch)
            removeFriendRequestGlobal(friend, dispatch)
            // push notify
        })
    }

    const handleDeny = () => {
        deleteFR(friend._id!)
        .then(() => {
            removeFriendRequestGlobal(friend, dispatch)
        })
    }

    return (
        <div onClick={() => console.log(111)}>
            <div>
                {
                    friend?.userInfo?.photoURL ? <Image src={friend?.userInfo?.photoURL} width={40} height={40} alt='' className='rounded-full' /> : null
                }
                <div></div>
            </div>
            <div>
                <div>
                    <button className="">{friend?.userInfo?.fullName}</button>
                    <div className="">01:10 PM</div>
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

const Title = styled.p`
    font-size: 18px;
    margin: 10px
`

const BoxItem = styled.div`
    padding: 10px;
`

const Container = styled.div.attrs(() => ({
    className: "box"
}))`
    width: 350px;
    position: absolute;
    height: 200px;
    background-color: white;
    border-radius: 10px;
    right: 11.3%;
    top: 8%;
`
    


