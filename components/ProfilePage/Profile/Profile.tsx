
import { useContext, useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase';
import { CustomAvatar } from '../../ChatPage/Chat';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useRouter } from 'next/router';

export default function Profile() {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [user] = useAuthState(auth);
    const [image, setImage]: any = useState(null)
    
    // const AppContext: any = useAppContext();

    useEffect(() => {
        const getUserInfo = async() => {
            const data = await db.collection("users").doc(user?.uid).get();
            if(data) {
                setPhoneNumber(data?.data()?.phoneNumber);
            }
        }
        getUserInfo().catch((err) => console.log(err));
        // console.log(AppContext)
    },[])

    const updateInfo = async(e: any) => {
        e.preventDefault();
        if  (phoneNumber.length !== 10) {
            toast('Phone error', { hideProgressBar: true, type: 'error', autoClose: 5000 })
            return;
        }
        db.collection("users").doc(user?.uid).update({ phoneNumber: phoneNumber }).catch((err) => console.log(err));
        toast('Update info successfully', { hideProgressBar: true, type: 'success', autoClose: 5000 })
    }

    const onImageChange = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            let  imgType = img['type'];
            let validImageTypes = ['image/jpeg', 'image/png'];
            let fileSize = img.size / 1024 / 1024;
            if (!validImageTypes.includes(imgType)) {
                toast('Image upload invalid !', { hideProgressBar: true, type: 'error', autoClose: 5000 })
            }
            if (fileSize > 5) {
                toast('Size image no larger than 5 MB !', { hideProgressBar: true, type: 'error', autoClose: 5000 })
            }
            setImage(URL.createObjectURL(img));
        }
    }

    const handleOnClickUploadBtn = () => {
        document.getElementById('input-upload-avatar')?.click()
    }

    const handlePhoneNumber = (e: any) => {
        setPhoneNumber(e.target.value)
    }

    return (
        <div className="container-xl">

            <hr className="mt-0 mb-4"/>
            <div className="row">
                <div className="col-xl-4">
                    <div className="card mb-4 mb-xl-0">
                        <div className="card-header">Profile Picture</div>
                        <div className="card-body text-center mx-auto">
                            {
                                image ? <AvatarProfile className='my-4' style={{backgroundImage: `url("${image}"`}} /> 
                                : <CustomAvatar
                                    src={user?.photoURL!}
                                    width={200}
                                    height={200}
                                    alt="User Avatar"
                                    className="my-4"
                                />
                            }
                            <div className="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
                            <button className="btn btn-primary mb-4" type="button" onClick={handleOnClickUploadBtn}>Upload new image</button>
                            <input type="file" id='input-upload-avatar' name="myImage" onChange={onImageChange} style={{display: 'none'}} />
                        </div>
                    </div>
                </div>
                <div className="col-xl-8">
                    <div className="card mb-4">
                        <div className="card-header">Account Details</div>
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label className="small mb-1" htmlFor="inputUsername">Full Name (how your name will appear to other users on the site)</label>
                                    <input className="form-control" id="inputUsername" type="text" placeholder="Enter your username" value={user?.displayName!}/>
                                </div>
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="small mb-2" htmlFor="Gender">Gender</label><br/>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"/>
                                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                                Male
                                            </label>
                                            </div>
                                            <div className="form-check">
                                            <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2"/>
                                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                                Female
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="small mb-1" htmlFor="inputLocation">Address</label>
                                    <input className="form-control" id="inputLocation" type="text" placeholder="Enter your location" value="San Francisco, CA"/>
                                </div>
                                <div className="mb-3">
                                    <label className="small mb-1" htmlFor="inputEmailAddress">Email</label>
                                    <input className="form-control" id="inputEmailAddress" type="email" required placeholder="Enter your email address" value={user?.email!}/>
                                </div>
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputPhone">Phone number</label>
                                        <input className="form-control" type="number" required placeholder="Enter your phone number" value={11111} onChange={handlePhoneNumber}/>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputBirthday">Birthday</label>
                                        <input className="form-control" id="inputBirthday" type="date" name="birthday" placeholder="Enter your birthday" value="06/10/1988"/>
                                    </div>
                                </div>
                                <button className="btn btn-primary" type="button" onClick={updateInfo}>Save changes</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const AvatarProfile = styled.div`
    background-position: center;
    background-repeat: no-repeat;
    object-fit: cover;
    border-radius: 50%;
    height: 200px;
    width: 200px;
`




