
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase';
import { CustomAvatar } from '../Chat';
import { toast } from 'react-toastify';


export default function Profile() {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [userInfo, setUserInfo]: any = useState({});
    const [user] = useAuthState(auth);

    useEffect(() => {
        const getUserInfo = async() => {
            const data = await db.collection("users").doc(user?.uid).get();
            if(data) {
                setUserInfo(data.data());
            }
        }
        getUserInfo().catch((err) => console.log(err));
    },[])

    const updateInfo = async(e: any) => {
        e.preventDefault();
        db.collection("users").doc(user?.uid).update({ phoneNumber: phoneNumber }).catch((err) => console.log(err));
        toast('Update info successfully', { hideProgressBar: true, type: 'success' })
    }

    return (
        <div className="container-xl">

    <hr className="mt-0 mb-4"/>
    <div className="row">
        <div className="col-xl-4">
            <div className="card mb-4 mb-xl-0">
                <div className="card-header">Profile Picture</div>
                <div className="card-body text-center mx-auto">
                    <CustomAvatar 
                        src={user?.photoURL!}
                        height={200} 
                        width={200}
                        alt='Profile Avatar'
                        className='my-4'
                    />
                    <div className="small font-italic text-muted mb-4">JPG or PNG no larger than 5 MB</div>
                    <button className="btn btn-primary mb-4" type="button">Upload new image</button>
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
                                <input className="form-control" id="inputPhone" type="number" required placeholder="Enter your phone number" value={userInfo?.phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
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




