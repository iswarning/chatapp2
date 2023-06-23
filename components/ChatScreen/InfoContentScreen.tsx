import { auth } from '@/firebase'
import { selectAppState } from '@/redux/appSlice'
import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSelector } from 'react-redux'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import SharedFile from './Message/SharedFile'
export default function InfoContentScreen() {

    const [user] = useAuthState(auth)
    const appState = useSelector(selectAppState)
    const [showSharedFile, setShowSharedFile] = useState(false)
    // const photoURL = appState.currentChat.isGroup ? appState.currentChat.photoURL.length > 0 ? appState.currentChat.photoURL : "/images/group-default.png" : ap

  return (
    <div className="info-content col-span-12 xl:col-span-3 flex flex-col pl-6 xl:pl-0 pr-6">
        <div className="overflow-y-auto py-6">
            {/* <div className="intro-y box relative px-4 py-6">
                <a href="javascript:;" className="text-gray-600 tooltip w-8 h-8 block flex items-center justify-center absolute top-0 right-0 mr-1 mt-1"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2 w-4 h-4"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg> </a>
                    <div className="w-20 h-20 mx-auto image-fit">
                        <img alt="Topson Messenger Tailwind HTML Admin Template" className="rounded-full" src="https://topson.left4code.com/dist/images/profile-9.jpg"/>
                        <div className="bg-green-500 border-white w-3 h-3 absolute right-0 top-0 mt-1 mr-1 rounded-full border-2"></div>
                    </div>
                <div className="text-base font-medium text-center mt-3">{}</div>
                <div className="text-gray-600 text-center text-xs uppercase mt-0.5">Software Engineer</div>
            </div>
            <div className="intro-y box p-4 mt-3">
                <div className="text-base font-medium">Personal Information</div>
                <div className="mt-4">
                    <div className="border-gray-200 dark:border-dark-5 flex items-center border-b pb-3">
                        <div className="">
                            <div className="text-gray-600">Country</div>
                            <div className="mt-0.5">New York City, USA</div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-globe w-4 h-4 text-gray-600 ml-auto"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                    </div>
                    <div className="border-gray-200 dark:border-dark-5 flex items-center border-b py-3">
                        <div className="">
                            <div className="text-gray-600">Phone</div>
                            <div className="mt-0.5">+32 19 23 62 24 34</div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mic w-4 h-4 text-gray-600 ml-auto"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                    </div>
                    <div className="border-gray-200 dark:border-dark-5 flex items-center py-3">
                        <div className="">
                            <div className="text-gray-600">Email</div>
                            <div className="mt-0.5">johntravolta@left4code.com</div>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail w-4 h-4 text-gray-600 ml-auto"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                </div>
            </div> */}
            <div className="intro-y h-full box p-4">
                <div className="text-base font-medium cursor-pointer" onClick={() => setShowSharedFile(!showSharedFile)}>Shared Files { showSharedFile ? <ArrowDropDownIcon fontSize='small' /> : <ArrowDropUpIcon fontSize='small' />}</div>
                
                {
                        showSharedFile ? <SharedFile /> : null
                }
                
            </div>
        </div>
    </div>
  )
}
