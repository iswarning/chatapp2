import { db } from '@/firebase';
import { ChunkFileType } from '@/types/ChunkFileType';
import { FileInMessageType } from '@/types/FileInMessageType'
import { MessageType } from '@/types/MessageType';
import { CircularProgress, Modal } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useCollection } from 'react-firebase-hooks/firestore';

export default function SenderTemplateFile({ 
    file, 
    message, 
    chatId, 
    timestamp, 
    lastIndex 
}: { 
    file: FileInMessageType | undefined, 
    message: MessageType, 
    chatId: string, 
    timestamp: any, 
    lastIndex: boolean 
}) {

    const handleDownloadFile = async() => {
        const response = await fetch(file?.url!);
        const blob = await response.blob();
        downloadBlob(blob, file?.name!)
    }

    function downloadBlob(blob: Blob, name: string) {
        // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
        const blobUrl = URL.createObjectURL(blob);
      
        // Create a link element
        const link = document.createElement("a");
      
        // Set link's href to point to the Blob URL
        link.href = blobUrl;
        link.download = name;
      
        // Append link to the body
        document.body.appendChild(link);
      
        // Dispatch click event on the link
        // This is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(
          new MouseEvent('click', { 
            bubbles: true, 
            cancelable: true, 
            view: window 
          })
        );
      
        // Remove link from body
        document.body.removeChild(link);
    }
  
    return (
    <>
    {
        file?.id ? <div className="intro-x chat-text-box flex items-end float-right mb-4">
            <div className="w-full">
                <div>
                    <div className="chat-text-box__content flex items-center float-right">
                        {/* <div className="hidden sm:block dropdown relative mr-3 mt-3">
                            <a href="javascript:;" className="dropdown-toggle w-4 h-4"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical w-4 h-4"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg> </a>
                            <div className="dropdown-menu w-40">
                                <div className="dropdown-menu__content box dark:bg-dark-1 p-2">
                                    <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-corner-up-left w-4 h-4 mr-2"><polyline points="9 14 4 9 9 4"></polyline><path d="M20 20v-7a4 4 0 0 0-4-4H4"></path></svg> Reply </a>
                                    <a href="" className="flex items-center p-2 transition duration-300 ease-in-out bg-white dark:bg-dark-1 hover:bg-gray-200 dark:hover:bg-dark-2 rounded-md"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash w-4 h-4 mr-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Delete </a>
                                </div>
                            </div>
                        </div> */}
                        <div className="box leading-relaxed text-gray-700 dark:text-gray-300 flex flex-col sm:flex-row items-center mt-3 p-3">
                            <div className="chat-text-box__content__icon text-white w-12 flex-none bg-contain relative bg-no-repeat bg-center block">
                                <div className="absolute m-auto top-0 left-0 right-0 bottom-0 flex items-center justify-center">{file?.type.toUpperCase()}</div>
                            </div>
                            <div className="sm:ml-3 mt-3 sm:mt-0 text-center sm:text-left">
                                <div className="text-gray-700 dark:text-gray-300 whitespace-nowrap font-medium truncate">{file?.name.length >= 20 ? file.name.substring(0, 20) + "..." : file?.name}</div>
                                <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">Size: { Number((file?.size!).toFixed(1)) } MB</div>
                            </div>
                            <div className="sm:ml-20 mt-3 sm:mt-0 flex">
                                <a href="javascript:void(0)" className="tooltip w-8 h-8 block border rounded-full flex-none flex items-center justify-center ml-2 outline-none" onClick={() => handleDownloadFile()}> 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-download w-4 h-4">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg> 
                                </a>
                                <a href="javascript:void(0)" className="tooltip w-8 h-8 block border rounded-full flex-none flex items-center justify-center ml-2"> 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-share w-4 h-4">
                                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                        <polyline points="16 6 12 2 8 6"></polyline>
                                        <line x1="12" y1="2" x2="12" y2="15"></line>
                                    </svg> 
                                </a>
                                <a href="javascript:void(0)" className="tooltip w-8 h-8 block border rounded-full flex-none flex items-center justify-center ml-2"> 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal w-4 h-4">
                                        <circle cx="12" cy="12" r="1"></circle>
                                        <circle cx="19" cy="12" r="1"></circle>
                                        <circle cx="5" cy="12" r="1"></circle>
                                    </svg> 
                                </a>
                            </div>

                        </div>
                        
                    </div>
                </div>
                
            </div>
            
        </div> : <>
            <div className="-intro-x chat-text-box flex items-end float-right mb-4">
                <div className="mr-4">
                </div>
                <div className="w-full">
                    <div>
                        <div className="chat-text-box__content flex items-center float-right">
                            
                            <div className="box leading-relaxed dark:text-gray-300 text-gray-700 px-4 py-3 mt-3"><CircularProgress color='info' /></div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    }
    <div className="clear-both"></div>
    </>
  )
}
