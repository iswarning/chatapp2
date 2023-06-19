import { selectAppState } from '@/redux/appSlice'
import { UserType } from '@/types/UserType'
import Image from 'next/image'
import React, { useState } from 'react'
import {useSelector} from 'react-redux'
import {useForm} from 'react-hook-form'

export default function SidebarGroups() {

    const [active, setActive] = useState("Members")
    const [listMember, setListMember] = useState<Array<UserType | undefined>>([])

    const CLASS_ACTIVE = "hover:bg-gray-100 dark:hover:bg-dark-2 flex-1 py-2 rounded-md text-center active"
    const CLASS_NOT_ACTIVE = "hover:bg-gray-100 dark:hover:bg-dark-2 flex-1 py-2 rounded-md text-center"
    const appState = useSelector(selectAppState)

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

    const handleAddMemberToGroup = (event: React.ChangeEvent<HTMLInputElement>, member: UserType | undefined) => {
        if (event.target.checked) {
            setListMember((old) => [...old, member])
        } else {
            setListMember(listMember.filter((mem) => mem?.id === member?.id))
        }
    }

  return (
    <>
        <div className="side-content col-span-12 xl:col-span-3 -mt-16 xl:mt-0 pt-20 xl:-mr-6 px-6 xl:pt-6 flex-col overflow-hidden side-content--active" data-content="groups">
            <div className="intro-y text-xl font-medium">Create Group</div>
            <div className="intro-y box p-2 mt-5 mb-6">
                <div className="boxed-tabs nav nav-tabs justify-center flex" role="tablist"> 
                    <a onClick={() => setActive("Members")} data-toggle="tab" data-target="#group-members" href="javascript:void(0)" className={active === "Members" ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} id="group-members-tab" role="tab" aria-controls="group-members" aria-selected="true">
                        Members
                    </a> 
                    <a onClick={() => setActive("Details")} data-toggle="tab" data-target="#group-details" href="javascript:void(0)" className={active === "Details" ? CLASS_ACTIVE : CLASS_NOT_ACTIVE} id="group-details-tab" role="tab" aria-controls="group-details" aria-selected="false">
                        Details
                    </a>
                </div>
            </div>
            <div className="intro-y overflow-y-auto scrollbar-hidden -mx-5 px-5">
                <div className="tab-content">
                    {
                        active === "Members" ? <div className="tab-pane active" id="group-members" role="tabpanel" aria-labelledby="group-members-tab">
                            <div className="user-list">
                                <div className="intro-x pb-6">
                                {
                                    appState.listFriend.length > 0 ? appState.listFriend.map((friend) => <div key={friend.id} className="intro-x block">
                                        <div className="box dark:bg-dark-3 cursor-pointer relative flex items-center px-4 py-3 zoom-in ">
                                            <div className="w-10 h-10 flex-none image-fit mr-1">
                                                {
                                                    friend?.userInfo?.photoURL ? <Image src={friend?.userInfo?.photoURL} width={48} height={48} alt='' className="rounded-full" /> : null
                                                }
                                                {
                                                    appState.userOnline?.find((u: any) => u === friend?.userInfo?.email) ? (
                                                        <div className="border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2" style={{background: 'green'}}></div>
                                                      ) : (
                                                        <span className="border-white w-3 h-3 absolute right-0 bottom-0 rounded-full border-2" style={{background: 'gray'}}></span>
                                                      )
                                                }
                                            </div>
                                            <div className="ml-2 overflow-hidden">
                                                <a href="javascript:void(0)" className="font-medium">{friend?.userInfo?.fullName}</a>
                                                <div className="flex items-center text-xs">
                                                    <div className="text-gray-600 whitespace-nowrap text-xs mt-0.5">{friend?.userInfo?.email}</div>
                                                </div>
                                            </div>
                                            <input className="form-check-switch ml-auto" type="checkbox" id="user-list-a-0" onChange={(event) => handleAddMemberToGroup(event, friend?.userInfo)}/>
                                        </div>
                                    </div>)  : null
                                }
                                </div>
                                <div className="user-list__action bg-theme-2 dark:bg-dark-6 -mx-5 px-5 pb-6">
                                    <button onClick={() => setActive("Details")} className="btn btn-primary text-white w-full">Next</button>
                                </div>
                            </div>
                        </div> : <div className="tab-pane active" id="group-details" role="tabpanel" aria-labelledby="group-details-tab">
                            <form onSubmit={handleSubmit((data) => console.log(data))}>
                            <div className="box p-4 mt-3 mb-6">
                                <div>
                                    <label htmlFor="create-group-form-1" className="form-label">Photo</label>
                                    <div className="image-upload border shadow-sm relative flex flex-col items-center justify-center rounded-md py-8 mt-3">
                                        <div className="image-upload__icon w-12 h-12 rounded-full flex items-center justify-center"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-image w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> </div>
                                        <div className="image-upload__info mt-2">Choose your group profile photo</div>
                                        <input type="file" className="w-full h-full top-0 left-0 absolute opacity-0" id="create-group-form-1" {...register('photo')}/>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="create-group-form-2" className="form-label">Group Name</label>
                                    <input type="text" className="form-control" id="create-group-form-2" {...register('groupName')}/>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="create-group-form-3" className="form-label">Tagline</label>
                                    <input type="text" className="form-control" id="create-group-form-3" {...register('tagLine')}/>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="create-group-form-4" className="form-label">Public</label>
                                    <div className="form-check">
                                        <input type="checkbox" className="form-check-switch" id="create-group-form-4" {...register('public')}/>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="create-group-form-5" className="form-label">Description</label>
                                    <textarea className="form-control" rows={5} id="create-group-form-5" {...register('description')}></textarea>
                                </div>
                                <button className="btn btn-primary w-full mt-3">Create Group</button>
                            </div>
                            </form>

                        </div>
                    }


                </div>
            </div>
        </div>
    </>
  )
}
