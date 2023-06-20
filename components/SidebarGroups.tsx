import { selectAppState, setListChat } from '@/redux/appSlice'
import { UserType } from '@/types/UserType'
import Image from 'next/image'
import React, { useState } from 'react'
import {useSelector,useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'
import { db, storage } from '@/firebase'
import { toast } from 'react-toastify'
import { MapChatData } from '@/types/ChatType'
import { v4 as uuidv4 } from 'uuid'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useQuery } from '@tanstack/react-query'
import MemberElement from './MemberElement'
import getRecipientEmail from '@/utils/getRecipientEmail'

export default function SidebarGroups() {

    const [active, setActive] = useState("Members")
    const [listMember, setListMember] = useState<Array<UserType | undefined>>([])

    const CLASS_ACTIVE = "hover:bg-gray-100 dark:hover:bg-dark-2 flex-1 py-2 rounded-md text-center active"
    const CLASS_NOT_ACTIVE = "hover:bg-gray-100 dark:hover:bg-dark-2 flex-1 py-2 rounded-md text-center"
    const appState = useSelector(selectAppState)
    const [image, setImage]: any = useState(null);
    const dispatch = useDispatch()

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

    const [friendSnapshot] = useCollection(
        db.collection("friends").where("users", "array-contains", appState.userInfo?.email)
    );

    const handleAddMemberToGroup = (checked: any, member: UserType | undefined) => {
        if (checked) {
            setListMember((old) => [...old, member])
        } else {
            removeMember(member)
        }
    }

    const removeMember = (userInfo: UserType | undefined) => {
        let array = [...listMember]; // make a separate copy of the array
        let itemExist = listMember.findIndex((mem: UserType | undefined) => mem?.id === userInfo?.id);
        if (listMember.length === 1) {
          setListMember([]);
          return;
        }
        if (itemExist) {
          array.splice(itemExist, 1);
          setListMember(array);
        }
    };

    const handleCreateNewGroupChat = (data: any) => {
        let members = listMember.map((m: any) => m.email);
        db.collection('chats').add({
            users: [...members, appState.userInfo.email],
            photoURL: "",
            isGroup: true,
            name: data.groupName,
            admin: appState.userInfo.email
        })
        .then(doc => {
            doc.get().then(snap => {
                if (image) {
                    fetch(image)
                    .then((response) => response.blob())
                    .then((blob) => {
                        let key = uuidv4()
                        let path = `public/chat-room/${snap.id}/avatar-group/${key}`
                        storage
                        .ref(path)
                        .put(blob)
                        .on(
                            "state_changed",
                            () => {

                            },
                            (err) => console.log(err),
                            () => {
                                storage
                                .ref(path)
                                .getDownloadURL()
                                .then((url) => {
                                    db
                                    .collection("chats")
                                    .doc(snap.id)
                                    .update({ photoURL: url })
                                })
                            }
                        )
                    })
                }
            })
        })
        .finally(() => {
            toast("Created group successfully !", {
                hideProgressBar: true,
                type: "info",
                autoClose: 5000,
            });
        })
    };

    const onImageChange = (event: any) => {
        event.preventDefault()
        if (event.target.files && event.target.files[0]) {
          let img = event.target.files[0];
          let imgType = img["type"];
          let validImageTypes = ["image/jpeg", "image/png"];
          let fileSize = img.size / 1024 / 1024;
          if (!validImageTypes.includes(imgType)) {
            toast("Image upload invalid !", {
              hideProgressBar: true,
              type: "error",
              autoClose: 5000,
            });
            return;
          }
          if (fileSize > 5) {
            toast("Size image no larger than 5 MB !", {
              hideProgressBar: true,
              type: "error",
              autoClose: 5000,
            });
            return;
          }
          setImage(URL.createObjectURL(img));
        }
    };

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
                                    friendSnapshot ? friendSnapshot.docs.map((friend) => 
                                        <MemberElement 
                                        email={getRecipientEmail(friend.data().users, appState.userInfo)} 
                                        handleAddMemberToGroup={(checked: boolean, userInfo: UserType) => handleAddMemberToGroup(checked, userInfo)} 
                                        listMember={listMember}
                                        />)  : null
                                }
                                </div>
                                <div className="user-list__action bg-theme-2 dark:bg-dark-6 -mx-5 px-5 pb-6">
                                    <button onClick={() => setActive("Details")} className="btn btn-primary text-white w-full">Next</button>
                                </div>
                            </div>
                        </div> : <div className="tab-pane active" id="group-details" role="tabpanel" aria-labelledby="group-details-tab">
                            <form onSubmit={handleSubmit(handleCreateNewGroupChat)}>
                            <div className="box p-4 mt-3 mb-6">
                                <div>
                                    <label htmlFor="create-group-form-1" className="form-label">Photo</label>
                                    <div className="image-upload border shadow-sm relative flex flex-col items-center justify-center rounded-md py-8 mt-3">
                                    
                                        {
                                            image && image.length > 0 ? <Image src={image} width={48} height={48} alt='' className='image-upload__icon w-12 h-12 rounded-full flex items-center justify-center' /> :  
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="feather feather-image w-5 h-5">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                                    <polyline points="21 15 16 10 5 21"></polyline>
                                                </svg>
                                        }
                                        
                                        <div className="image-upload__info mt-2">Choose your group profile photo</div>
                                        <input type="file" className="w-full h-full top-0 left-0 absolute opacity-0" id="create-group-form-1" onChange={onImageChange}/>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <label htmlFor="create-group-form-2" className="form-label">Group Name</label>
                                    <input type="text" className="form-control" id="create-group-form-2" {...register('groupName', { required: true })}/>
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
                                <button type='submit' className="btn btn-primary w-full mt-3" disabled={listMember.length < 2}>Create Group</button>
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
