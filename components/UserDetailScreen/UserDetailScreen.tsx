import { StatusFriendBtn, Container, InformationContainer, Label, SendMessageBtnUser, TextFriend, TextGroup, TextGroupCol, TextGroupRow, TextName, UpperImage, UserAvatar, UserBtnGroup, UserContainer, UserInfo, UserProfile, Value, ValueContainer } from "./UserDetailScreenStyled";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import MessageIcon from '@mui/icons-material/Message';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import createNewFriendRequest from "@/services/friend-requests/createNewFriendRequest";
import getFriendRequestsByEmail from "@/services/friend-requests/getFriendRequestsByEmail";
import BlockIcon from '@mui/icons-material/Block';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import deleteFriendRequest from "@/services/friend-requests/deleteFriendRequest";
import deleteFriend from "@/services/friends/deleteFriend";
import getFriendByEmails from "@/services/friends/getFriendByEmails";
import { useEffect, useState } from "react";

export default function UserDetailScreen({userInfo, statusFriend}: any) {

    const [status, setStatus] = useState(statusFriend);

    const [user] = useAuthState(auth);

    const onAddFriend = () => {
        createNewFriendRequest(user?.email!, String(userInfo?.email));
        setStatus('isFriendRequest');
    }

    const onCancelFriendRequest = () => {
        getFriendRequestsByEmail(user?.email!, String(userInfo?.email)).then((friendRequest: any) => {
            deleteFriendRequest(friendRequest.id);
            setStatus('isStranger');
        });
    }

    const onUnFriend = () => {
        if(confirm('Do you want to unfriend?')){
            getFriendByEmails(user?.email!, String(userInfo?.email)).then((friend) => {
                if(friend?.exists) {
                    deleteFriend(friend?.id);
                    setStatus('isStranger');
                }
            });
        }
    }

    const showStatusFriend = () => {
        switch(status) {
            case 'isStranger':
                return <UserBtnGroup>
                            <StatusFriendBtn onClick={onAddFriend}><PersonAddIcon />&nbsp; Thêm bạn bè</StatusFriendBtn>
                            <SendMessageBtnUser><MessageIcon />&nbsp; Gửi tin nhắn</SendMessageBtnUser>
                        </UserBtnGroup> 
            case 'isFriendRequest':
                return <UserBtnGroup>
                            <SendMessageBtnUser onClick={onCancelFriendRequest}><BlockIcon />&nbsp; Hủy yêu cầu</SendMessageBtnUser>
                            <StatusFriendBtn><MessageIcon />&nbsp; Gửi tin nhắn</StatusFriendBtn>
                        </UserBtnGroup> 
            case 'isFriend':
                return <UserBtnGroup>
                            <SendMessageBtnUser onClick={onUnFriend}><HowToRegIcon />&nbsp; Bạn bè</SendMessageBtnUser>
                            <StatusFriendBtn><MessageIcon />&nbsp; Gửi tin nhắn</StatusFriendBtn>
                        </UserBtnGroup>
            case 'isPendingAccept':
                return <UserBtnGroup>
                            <SendMessageBtnUser disabled>Pending Accept...</SendMessageBtnUser>
                            <StatusFriendBtn><MessageIcon />&nbsp; Gửi tin nhắn</StatusFriendBtn>
                        </UserBtnGroup>
                
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
                        <TextFriend>100 Bạn bè</TextFriend>
                    </UserInfo>
                      
                </UserProfile>
                {showStatusFriend()} 
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
                                <Value>{ userInfo?.birthday ?? '21-12'}</Value>
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
            </InformationContainer>
        </Container>
    )
}