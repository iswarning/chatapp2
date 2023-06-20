import { db } from '@/firebase'
import React from 'react'
import { useCollection } from 'react-firebase-hooks/firestore'
import Image from 'next/image'
import {useSelector} from 'react-redux'
import { selectAppState } from '@/redux/appSlice'
import { MapUserData, UserType } from '@/types/UserType'

export default function MemberElement({ email, handleAddMemberToGroup, listMember }: { email: string, handleAddMemberToGroup: any, listMember: Array<UserType | undefined> }) {

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
        userInfo ? <div key={userInfo.docs?.[0].id} className="intro-x block">
            <div className="box dark:bg-dark-3 cursor-pointer relative flex items-center px-4 py-3 zoom-in ">
                <div className="w-10 h-10 flex-none image-fit mr-1">
                    {
                        userInfo.docs?.[0].data()?.photoURL ? <Image src={userInfo.docs?.[0].data().photoURL} width={48} height={48} alt='' className="rounded-full" /> : null
                    }
                    {
                        appState.userOnline?.find((u: any) => u === userInfo.docs?.[0].data().email) ? (
                            <div className="border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2" style={{background: 'green'}}></div>
                            ) : (
                            <span className="border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2" style={{background: 'gray'}}></span>
                            )
                    }
                </div>
                <div className="ml-2 overflow-hidden">
                    <a href="javascript:void(0)" className="font-medium">{userInfo.docs?.[0].data().fullName}</a>
                    <div className="flex items-center text-xs">
                        <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">{userInfo.docs?.[0].data().email}</div>
                    </div>
                </div>
                <input className="form-check-switch ml-auto" type="checkbox" key={Math.random()} name="addMember" onChange={(event) => handleAddMemberToGroup(event.target.checked, MapUserData(userInfo.docs?.[0]))} defaultChecked={listMember.filter((mem) => mem?.id === userInfo?.docs?.[0].id).length > 0}/>
            </div>
        </div> : null
    }
    </>
    
  )
}
