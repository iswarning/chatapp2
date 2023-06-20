import { auth } from '@/firebase'
import { selectAppState } from '@/redux/appSlice'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useSelector } from 'react-redux'
export default function InfoContentScreen() {

    const [user] = useAuthState(auth)
    const appState = useSelector(selectAppState)

    // const photoURL = appState.currentChat.isGroup ? appState.currentChat.photoURL.length > 0 ? appState.currentChat.photoURL : "/images/group-default.png" : ap

  return (
    <div className="info-content col-span-12 xl:col-span-3 flex flex-col overflow-hidden pl-6 xl:pl-0 pr-6">
        <div className="overflow-y-auto scrollbar-hidden py-6">
            <div className="intro-y box relative px-4 py-6">
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
            </div>
            <div className="intro-y h-full box flex flex-col p-4 mt-3">
                <div className="text-base font-medium">Shared Files</div>
                <div className="mt-4 overflow-x-hidden overflow-y-auto scrollbar-hidden">
                    <div className="shared-file border-gray-200 dark:border-dark-5 flex items-center p-3 border rounded-md relative ">
                        <div className="shared-file__icon text-white w-12 flex-none bg-contain relative bg-no-repeat bg-center block">
                            <div className="absolute m-auto top-0 left-0 right-0 bottom-0 flex items-center justify-center">JPG</div>
                        </div>
                        <div className="w-full ml-3">
                            <div className="text-gray-700 dark:text-gray-300 w-4/5 whitespace-nowrap font-medium truncate">preview-8.jpg</div>
                            <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">1.2 MB Image File</div>
                        </div>
                        <div className="dropdown absolute flex items-center top-0 bottom-0 right-0 mr-4 ml-auto">
                            <a className="dropdown-toggle w-4 h-4" href="javascript:;" aria-expanded="false"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </a>
                            <div className="dropdown-menu w-40">
                                <div className="dropdown-menu__content box dark:bg-dark-1 p-2">
                                    <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share-2 w-4 h-4 mr-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> Share </a>
                                    <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download w-4 h-4 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="shared-file border-gray-200 dark:border-dark-5 flex items-center p-3 border rounded-md relative mt-3">
                        <div className="shared-file__icon text-white w-12 flex-none bg-contain relative bg-no-repeat bg-center block">
                            <div className="absolute m-auto top-0 left-0 right-0 bottom-0 flex items-center justify-center">MP4</div>
                        </div>
                        <div className="w-full ml-3">
                            <div className="text-gray-700 dark:text-gray-300 w-4/5 whitespace-nowrap font-medium truncate">Celine Dion - Ashes.mp4</div>
                            <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">20 MB Audio File</div>
                        </div>
                        <div className="dropdown absolute flex items-center top-0 bottom-0 right-0 mr-4 ml-auto">
                            <a className="dropdown-toggle w-4 h-4" href="javascript:;" aria-expanded="false"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </a>
                            <div className="dropdown-menu w-40">
                                <div className="dropdown-menu__content box dark:bg-dark-1 p-2">
                                    <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share-2 w-4 h-4 mr-2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg> Share </a>
                                    <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download w-4 h-4 mr-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg> Download </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
