import { CardContentCustom, Container, SendMessageBtn, UnfriendBtn } from "../Friend/FriendStyled";
import { useEffect, useState } from "react";
import { Card, CardMedia, Typography } from "@mui/material";
import getUserByEmail from "@/services/users/getUserByEmail";
import createFriend from "@/services/friends/createFriend";
import deleteFriendRequest from "@/services/friend-requests/deleteFriendRequest";
import getFriendRequestsByEmail from "@/services/friend-requests/getFriendRequestsByEmail";

export default function FriendRequest({senderEmail, recipientEmail}: any) {

    const [userInfo, setUserInfo]: any = useState({});

    useEffect(() => {
        getUserByEmail(String(senderEmail)).then((userData) => setUserInfo(userData.data()));
    },[]);

    const onAccept = () => {
        createFriend(senderEmail, recipientEmail);
        onCancel();
    }

    const onCancel = () => {
        getFriendRequestsByEmail(senderEmail, recipientEmail).then((friendRequest: any) => {
            deleteFriendRequest(friendRequest.id);
        });
    }

    return (
        <Container>
            <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                    sx={{ height: 220 }}
                    image={userInfo?.photoURL ?? ''}
                    title="Avatar"
                >
                </CardMedia>
                <CardContentCustom>
                    <Typography gutterBottom variant="h5" component="div">
                    {userInfo?.fullName ?? 'Albert Einstein'}
                    </Typography>
                    <SendMessageBtn onClick={onAccept}>Chấp nhận</SendMessageBtn>
                    <UnfriendBtn onClick={onCancel}>Từ chối</UnfriendBtn>
                </CardContentCustom>
            </Card>
        </Container>
    )
}