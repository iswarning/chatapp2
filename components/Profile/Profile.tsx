import EditIcon from '@mui/icons-material/Edit';
import { InformationContainer,
    UserContainer,
    Container,
    UpperImage,
    UserProfile,
    UserAvatar,
    UserInfo,
    TextName,
    TextFriend,
    TextGroupRow,
    TextGroupCol,
    TextGroup,
    Label,
    ValueContainer,
    Value} from '../UserDetailScreen/UserDetailScreenStyled';
import { useEffect, useState } from 'react';
import getAllFriendOfUser from '@/services/friends/getAllFriendOfUser';
import styled from 'styled-components';
import ReactModal from 'react-modal';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/firebase';
import getUserById from '@/services/users/getUserById';
import createNewUser from '@/services/users/createNewUser';
import firebase from 'firebase';


export default function Profile() {

    const [amountFriends, setAmountFriends] = useState(0);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userInfo, setUserInfo]: any = useState({});
    const [user] = useAuthState(auth);

    useEffect(() => {
        getListFriend();
        getUserInfo();
    },[])

    const getUserInfo = async() => {
        const data = await getUserById(user?.uid!);
        if(data) {
            setUserInfo(data);
        }
    }

    const getListFriend = async() => {
        const f = await getAllFriendOfUser(user?.email!);
        if(f.length > 0) {
            setAmountFriends(f.length);
        }
    }

    const updateInfo = (e: any) => {
        e.preventDefault()
        // let userExist: firebase.User = {
        //     email: user?.email,
        //     photoURL: user?.photoURL,
        //     fullName: user?.displayName,
        //     phoneNumber: phoneNumber
        // }
        db.collection("users").where("id", "==", user?.uid)
        .get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                console.log(doc.id, " => ", doc.data());
                doc.ref.update({ phoneNumber: phoneNumber })
            });
        }).catch(err => console.log(err))
        getUserInfo();
        setIsOpenModal(!isOpenModal);
    }

    const handleOpenModal = () => {
        setIsOpenModal(!isOpenModal);
        setPhoneNumber(userInfo.phoneNumber)
    }

    return (
        <Container>
            <UserContainer>
                <UpperImage src={userInfo?.upperImage ?? '/images/upper-image-default.png'} />
                <UserProfile>
                    <UserAvatar src={userInfo?.photoURL ?? '/images/avatar-default.jpg'} />
                    <UserInfo>
                        <TextName>{ userInfo?.displayName ?? 'Albert Einstein'}</TextName>
                        <TextFriend>{amountFriends} Friends</TextFriend>
                    </UserInfo>
                </UserProfile>
            </UserContainer>
            <InformationContainer>           
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Email:</Label>
                            <ValueContainer>
                                <Value>{ userInfo?.email ?? 'mail@gmail.com'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Birthday:</Label>
                            <ValueContainer>
                                <Value>{ userInfo?.birthday ?? '21-12-2012'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Address:</Label>
                            <ValueContainer>
                                <Value>{ userInfo?.address ?? 'Los Angeles California San Fransisco'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Gender:</Label>
                            <ValueContainer>
                                <Value>{ userInfo?.gender ?? 'Male'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Phone:</Label>
                            <ValueContainer>
                                <Value>{ userInfo?.phoneNumber ?? '0909999000'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
                <UpdateButton onClick={handleOpenModal}><EditIcon fontSize='small'/> Edit Information</UpdateButton>
            </InformationContainer>
            <ModalUpdateInfo isOpen={isOpenModal} onRequestClose={() => setIsOpenModal(false)}>
                <h3>Update Information</h3>
                <form role="form" method="POST" action="">
                    <input type="hidden" name="_token" value=""/>
                    <div className="form-group my-3">
                        <label className="control-label">Phone Number</label>
                        <div>
                            <input type="number" className="form-control input-lg" name="email" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
                        </div>
                    </div>
                    <div className="form-group my-3">
                        <div>
                            <button type="button" className="btn" style={{background: '#0DA3BA', color: 'white'}} onClick={(e) => updateInfo(e)}>Update</button>
                        </div>
                    </div>
                </form>
            </ModalUpdateInfo>
        </Container>
    )
}

const ModalUpdateInfo = styled(ReactModal)`
border-radius: 10px;
    border: 1px solid whitesmoke;
    width: 400px;
    height: 600px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100px;
    background-color: white;
    padding: 30px;
`

const UpdateButton = styled.button`
    color: white;
    background-color: #0DA3BA;
    padding: 5px 7px 5px 7px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    width: max-content;
    height: 40px;
    
    :hover {
        opacity: 0.7;
    }
`;



