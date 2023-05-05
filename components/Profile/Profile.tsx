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
import getFriendByEmails from '@/services/friends/getFriendByEmails';
import getAllFriendOfUser from '@/services/friends/getAllFriendOfUser';
import { AcceptBtn } from '../FriendRequest/FriendRequestStyled';
import styled from 'styled-components';


export default function Profile({userInfo}: any) {

    const [amountFriends, setAmountFriends] = useState(0);

    useEffect(() => {
        getListFriend();
    },[])

    const getListFriend = async() => {
        const f = await getAllFriendOfUser(userInfo?.email);
        if(f.length > 0) {
            setAmountFriends(f.length);
        }
    }

    return (
        <Container>
            <UserContainer>
                <UpperImage src={userInfo?.upperImage ?? '/images/upper-image-default.png'} />
                <UserProfile>
                    <UserAvatar src={userInfo?.photoURL ?? '/images/avatar-default.jpg'} />
                    <UserInfo>
                        <TextName>{ userInfo?.fullName ?? 'Albert Einstein'}</TextName>
                        <TextFriend>{amountFriends} friend</TextFriend>
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
                <UpdateButton><EditIcon fontSize='small'/>Edit Information</UpdateButton>
            </InformationContainer>
        </Container>
    )
}

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



