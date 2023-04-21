import { auth, db } from "@/firebase";
import { CardContentCustom, Container, SendMessageBtn, UnfriendBtn, UserAvatar } from "./FriendStyled";
import { useEffect, useState } from "react";
import { Card, CardMedia, Typography } from "@mui/material";
import getUserByEmail from "@/services/users/getUserByEmail";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "@/utils/getRecipientEmail";
import getFriendByEmails from "@/services/friends/getFriendByEmails";
import deleteFriend from "@/services/friends/deleteFriend";

export default function Friend({users}: any) {

    const [userInfo, setUserInfo]: any = useState({});
    const [user] = useAuthState(auth);

    useEffect(() => {
        getUserByEmail(getRecipientEmail(users, user)).then((u) => setUserInfo(u.data()));
    },[]);

    const onUnfriend = () => {
        if(confirm('Do you want to unfriend?')){
            getFriendByEmails(user?.email!, String(userInfo?.email)).then((friend) => {
                if(friend?.exists) {
                    deleteFriend(friend?.id);
                }
            });
        }
    }

    return (
        <Container>
            <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                    sx={{ height: 220 }}
                    image={userInfo?.upperImage ?? '/images/upper-image-default.png'}
                    title="Upper Image"
                >
                    <UserAvatar src={userInfo?.photoURL ?? '/images/avatar-default.jpg'} />
                </CardMedia>
                <CardContentCustom>
                    <Typography gutterBottom variant="h5" component="div">
                    Lizard
                    </Typography>
                    <SendMessageBtn>Gửi tin nhắn</SendMessageBtn>
                    <UnfriendBtn onClick={onUnfriend}>Hủy bạn bè</UnfriendBtn>
                </CardContentCustom>
            </Card>
        </Container>
    )
}