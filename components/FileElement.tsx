import { storage } from '@/firebase';
import { CircularProgress } from '@mui/material';
import Image from 'next/image'
import React from 'react'
import { useDownloadURL } from 'react-firebase-hooks/storage';

export default function FileElement({ file, chatRoomId }: any) {

    const isFile = file.type !== 'jpeg' && file.type !== "png"

    const fileName = file.name.length > 20 ? file.name.slice(0, 20) + "..." : file.name

const [value, loading, error] = useDownloadURL(
    storage
    .ref(file.path));

  return (
    <div className="shared-file border-gray-200 dark:border-dark-5 flex items-center p-3 border rounded-md relative mt-3">
        {
            isFile ? <div className="shared-file__icon text-white w-12 flex-none bg-contain relative bg-no-repeat bg-center block">
                <div className="absolute m-auto top-0 left-0 right-0 bottom-0 flex items-center justify-center">{file.type.toUpperCase()}</div>
            </div> : value ? loading ? <div className='text-center'><CircularProgress size={30} /></div> :<Image src={value!} width={0} height={0} alt='' className='rounded-md' style={{height: '50px', width: '50px'}} /> : null
        }
        <div className="w-full ml-3">
            <div className="text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium truncate">{fileName}</div>
            <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">{Number((file?.size!).toFixed(1))} MB</div>
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
  )
}
