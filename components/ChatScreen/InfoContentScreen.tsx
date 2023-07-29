import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import SharedFile from './Message/SharedFile'
import Image from 'next/image'
import CustomChat from '../CustomChat'
import MemberInChat from '../MemberInChat'
import { selectChatState } from '@/redux/chatSlice'
import {v4 as uuidv4} from 'uuid'

export default function InfoContentScreen() {

    const chatState = useSelector(selectChatState)
    const [showSharedFile, setShowSharedFile] = useState(false)
    const [showCustom, setShowCustom] = useState(false)
    const [showMember, setShowMember] = useState(false)

    const currentChat = chatState.listChat[chatState.currentChat.index]
    const recipientInfo = currentChat.recipientInfo
    const listRecipientInfo = currentChat.listRecipientInfo ?? []
    
    const getRecipientAvatar = () => {
        if (currentChat.isGroup) {
          if (currentChat.photoURL!.length > 0) return currentChat.photoURL;
          else return "/images/group-default.jpg";
        } else {
          let photoUrl = recipientInfo?.photoURL ?? null;
          if (photoUrl) return photoUrl;
          else return "/images/avatar-default.png";
        }
    };

  return (
    <>
            <div className="info-content col-span-12 xl:col-span-3 flex flex-col pl-6 xl:pl-0 pr-6">
                <div className="py-6">
                    <div className="intro-y box relative px-4 py-6">
                        <a href="javascript:;" className="text-gray-600 tooltip w-8 h-8 block flex items-center justify-center absolute top-0 right-0 mr-1 mt-1"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2 w-4 h-4"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg> </a>
                            <div className="w-20 h-20 mx-auto image-fit">
                                {
                                    getRecipientAvatar() ? <Image src={getRecipientAvatar()!} width={100} height={100} alt='' className='rounded-full' /> : null
                                }
                            </div>
                        <div className="text-base font-medium text-center mt-3">{ currentChat.isGroup ? "Group: " + currentChat.name : recipientInfo?.fullName}</div>
                    </div>
                </div>
                <div className="py-2">
                    <div className="intro-y h-full box p-4">
                        <div className="text-base font-medium cursor-pointer" onClick={() => setShowSharedFile(!showSharedFile)}>Custom chat { showSharedFile ? <ArrowDropDownIcon fontSize='small' /> : <ArrowDropUpIcon fontSize='small' />}</div>
                        
                        {
                                showSharedFile ? <CustomChat /> : null
                        }
                        
                    </div>
                </div>
                <div className="py-2">
                    <div className="intro-y h-full box p-4">
                        <div className="text-base font-medium cursor-pointer" onClick={() => setShowCustom(!showCustom)}>Shared Files { showCustom ? <ArrowDropDownIcon fontSize='small' /> : <ArrowDropUpIcon fontSize='small' />}</div>
                        
                        {
                                showCustom ? <SharedFile /> : null
                        }
                        
                    </div>
                </div>
                {
                    currentChat.isGroup ? <div className="py-2">
                        <div className="intro-y h-full box p-4">
                            <div className="text-base font-medium cursor-pointer" onClick={() => setShowMember(!showMember)}>Members in chat { showMember ? <ArrowDropDownIcon fontSize='small' /> : <ArrowDropUpIcon fontSize='small' />}</div>
                            
                            <div className="overflow-x-hidden overflow-y-auto" style={{maxHeight: '450px'}}>
                                {
                                    showMember && listRecipientInfo.length > 0 ? listRecipientInfo.map((info) => 
                                            <MemberInChat key={uuidv4()} info={info} />)  : null
                                }
                            </div>
                            
                        </div>
                    </div> : null
                }

                
            </div>
    
    </>

  )
}
