import { StatusFriendBtn, Container, InformationContainer, Label, SendMessageBtnUser, TextFriend, TextGroup, TextGroupCol, TextGroupRow, TextName, UpperImage, UserAvatar, UserBtnGroup, UserContainer, UserInfo, UserProfile, Value, ValueContainer } from "./UserDetailScreenStyled";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MessageIcon from '@mui/icons-material/Message';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import createNewFriendRequest from "@/services/friend-requests/createNewFriendRequest";
import findFriendByEmail from "@/services/friends/findFriendByEmail";
import getFriendRequestsByEmail from "@/services/friend-requests/getFriendRequestsByEmail";
import BlockIcon from '@mui/icons-material/Block';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useEffect, useState } from "react";
import { User } from "@/models/User";
import getUserById from "@/services/users/getUserById";

export default function UserDetailScreen({userInfo}: any) {

    const [user] = useAuthState(auth);
    const [userData, setUserData]: any = useState();

    useEffect(() => {
        console.log(121212121)
        // setUserData(JSON.parse(userInfo.data));
    },[])

    const handleAddFriend = () => {
        createNewFriendRequest(user?.email!, userData?.email!);
    }

    const showStatusFriend = () => {
        let status = 'isStranger';
        // findFriendByEmail(user?.email!, userInfo?.email).then((friend) => {
        //     if(friend.length > 0) {
        //         status = 'isFriend';
        //     }
        // });
        getFriendRequestsByEmail(user?.email!, String(userData?.email)).then((friendRequest) => {
            if(friendRequest?.length > 0 && !friendRequest?.[0]?.data()?.isAccept)
                status = 'isFriendRequest';
            if(friendRequest?.length > 0 && friendRequest?.[0]?.data()?.isAccept)
                status = 'isFriend';
        });

        switch(status) {
            case 'isStranger':
                return <StatusFriendBtn onClick={handleAddFriend}><PersonAddIcon />&nbsp; Thêm bạn bè</StatusFriendBtn>
            case 'isFriendRequest':
                return <StatusFriendBtn onClick={handleAddFriend}><BlockIcon />&nbsp; Hủy kết bạn</StatusFriendBtn> 
            case 'isFriend':
                return <StatusFriendBtn onClick={handleAddFriend}><HowToRegIcon />&nbsp; Bạn bè</StatusFriendBtn>
        }
    }

    return (
        <Container>
            <UserContainer>
                {/* <UpperImage src={userData?.upperImage ?? '/images/upper-image-default.png'} />
                <UserProfile>
                    <UserAvatar src={userData?.photoURL ?? '/images/avatar-default.jpg'} />
                    <UserInfo>
                        <TextName>{ userData?.name ? userData?.name : 'Albert Einstein'}</TextName>
                        <TextFriend>100 Bạn bè</TextFriend>
                    </UserInfo>
                </UserProfile> */}
                <UserBtnGroup>
                    {/* {showStatusFriend()} */}
                    <SendMessageBtnUser><MessageIcon />&nbsp; Gửi tin nhắn</SendMessageBtnUser>
                </UserBtnGroup>
            </UserContainer>
            <InformationContainer>
                
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Email:</Label>
                            <ValueContainer>
                                <Value>{ userData?.email ? userData?.email : 'mail@gmail.com'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
                <TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Birthday:</Label>
                            <ValueContainer>
                                <Value>{ userData?.birthday ? userData?.birthday : '21-12'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow><TextGroupRow>
                    <TextGroupCol>
                        <TextGroup>
                            <Label>Gender:</Label>
                            <ValueContainer>
                                <Value>{ userData?.gender ? userData?.gender : 'Male'}</Value>
                            </ValueContainer>
                        </TextGroup>
                    </TextGroupCol>
                </TextGroupRow>
            </InformationContainer>
        </Container>
    )
}