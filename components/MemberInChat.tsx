import React, { useState } from 'react'
import Image from 'next/image'
import { useCollection } from 'react-firebase-hooks/firestore'
import { db } from '@/firebase'
import { MapUserData } from '@/types/UserType'
import {useDispatch,useSelector} from 'react-redux'
import { selectAppState } from '@/redux/appSlice'
import styled from 'styled-components'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { selectChatState } from '@/redux/chatSlice'
export default function MemberInChat({email}: {email: string}) {
  const [showAction, setShowAction] = useState(false)
  const [userInfo] = useCollection(
    db
    .collection("users")
    .where("email",'==',email)
    .limit(1)
  )

  const info = MapUserData(userInfo?.docs?.[0]!)

  const appState = useSelector(selectAppState)
  const chatState = useSelector(selectChatState)

  return (
    <div className="shared-file border-gray-200 dark:border-dark-5 flex items-center p-3 border rounded-md mt-3">
        <Image src={info.photoURL} width={40} height={40} alt='' className='rounded-full'/>
        <div className="w-full ml-3">
            <div className="text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium truncate">{info.fullName}</div>
            <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">{info.email}</div>
        </div>
        <div className="">
            {/* <a onClick={() => dispatch(setAppState({ data: !appState.AppState.showDropdownActionUser, type: "App/DropdownActionUser" }))} className="dropdown-toggle w-4 h-4" href="javascript:;" aria-expanded="false"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </a> */}
            <a onClick={() => setShowAction(!showAction)} className="" href="javascript:;" aria-expanded="false"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </a>
            {
              showAction ? <ActionContainer className='box'>
              <ActionElement className='mb-2'><AccountCircleIcon fontSize='small' /> Profile</ActionElement>
                {
                  chatState.currentChat.admin === appState.userInfo.email ? <ActionElement><ExitToAppIcon fontSize='small' /> This user leave group</ActionElement> : null
                }
              </ActionContainer>: null
            }
        </div>
    </div>
  )
}

const ActionContainer = styled.div`
border: 1px solid silver;
  width: max-content;
  position: absolute;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  right: 0;
`

const ActionElement = styled.div`
  cursor: pointer;
  :hover {
    background-color: whitesmoke;
    border-radius: 10px;
  }
  padding: 5px;
`
