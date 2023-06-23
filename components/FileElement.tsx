import React from 'react'

export default function FileElement({file}: any) {
  return (
    <div className="shared-file border-gray-200 dark:border-dark-5 flex items-center p-3 border rounded-md relative mt-3">
        <div className="shared-file__icon text-white w-12 flex-none bg-contain relative bg-no-repeat bg-center block">
            <div className="absolute m-auto top-0 left-0 right-0 bottom-0 flex items-center justify-center">{file.type}</div>
        </div>
        <div className="w-full ml-3">
            <div className="text-gray-700 dark:text-gray-300 w-4/5 whitespace-nowrap font-medium truncate">{file.name}</div>
            <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">{file.size ?? "None"} MB Image File</div>
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
