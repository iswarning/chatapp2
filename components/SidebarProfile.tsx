import { auth } from '@/firebase'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import Image from 'next/image'
export default function SidebarProfile() {

    const [user] = useAuthState(auth)

  return (
    <>
        <div className="side-content col-span-12 xl:col-span-3 -mt-16 xl:mt-0 pt-20 xl:-mr-6 px-6 xl:pt-6 flex-col overflow-hidden side-content--active" data-content="profile">
<div className="intro-y text-xl font-medium">Profile</div>
<div className="intro-y box relative px-4 py-6 mt-5">
<a href="javascript:void(0)" className="text-gray-600 tooltip w-8 h-8 block flex items-center justify-center absolute top-0 right-0 mr-1 mt-1"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2 w-4 h-4"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg> </a>
<div className="w-20 h-20 mx-auto image-fit">
{
    user?.photoURL ? <Image src={user?.photoURL} width={80} height={80} alt='' className='rounded-full' /> : null
}
<div className="bg-green-500 border-white w-3 h-3 absolute right-0 top-0 mt-1 mr-1 rounded-full border-2"></div>
</div>
<div className="text-base font-medium text-center mt-3">{user?.displayName}</div>
<div className="text-gray-600 text-center text-xs uppercase mt-0.5">Software Engineer</div>
</div>
<div className="intro-y box p-4 mt-3">
<div className="border-gray-200 dark:border-dark-5 flex items-center border-b pb-3">
<div className="">
<div className="text-gray-600">Country</div>
<div className="capitalize mt-0.5">New York City, USA</div>
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
<div className="border-gray-200 dark:border-dark-5 flex items-center border-b py-3">
<div className="">
<div className="text-gray-600">Gender</div>
<div className="capitalize mt-0.5">male</div>
</div>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail w-4 h-4 text-gray-600 ml-auto"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
</div>
<div className="border-gray-200 dark:border-dark-5 flex items-center py-3">
<div className="">
<div className="text-gray-600">Email</div>
<div className="mt-0.5">{user?.email}</div>
</div>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail w-4 h-4 text-gray-600 ml-auto"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
</div>
</div>
<div className="intro-y box p-4 mt-3">
<div className="border-gray-200 dark:border-dark-5 flex items-center border-b pb-3">
<div className="">
<div className="text-gray-600">Twitter</div>
<a className="mt-0.5" href="">@johntravolta</a>
</div>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-twitter w-4 h-4 text-gray-600 ml-auto"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
</div>
<div className="border-gray-200 dark:border-dark-5 flex items-center border-b py-3">
<div className="">
<div className="text-gray-600">Facebook</div>
<a className="mt-0.5" href="">johntravolta</a>
</div>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-facebook w-4 h-4 text-gray-600 ml-auto"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
</div>
<div className="border-gray-200 dark:border-dark-5 flex items-center py-3">
<div className="">
<div className="text-gray-600">Instagram</div>
<a className="mt-0.5" href="">@johntravolta</a>
</div>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-instagram w-4 h-4 text-gray-600 ml-auto"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
</div>
</div>
</div>
    </>
  )
}
