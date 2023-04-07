import { db } from "@/firebase";
import { CardContentCustom, Container, SendMessageBtn, UnfriendBtn } from "./FriendStyled";
import { useEffect, useState } from "react";
import { Card, CardMedia, Typography } from "@mui/material";
import getUserByEmail from "@/services/users/getUserByEmail";

export default function Friend(email: any) {

    const [userInfo, setUserInfo]: any = useState();

    useEffect(() => {
        getUserByEmail(email).then((userData) => setUserInfo(userData));
    },[]);

    return (
        <Container>
            <Card sx={{ maxWidth: 345 }}>
                <CardMedia
                    sx={{ height: 140 }}
                    image="https://static1.cbrimages.com/wordpress/wp-content/uploads/2021/12/Jujutsu-Kaisen-0-Yuta-3.jpg"
                    title="green iguana"
                />
                <CardContentCustom>
                    <Typography gutterBottom variant="h5" component="div">
                    Lizard
                    </Typography>
                    <SendMessageBtn>Send Message</SendMessageBtn>
                    <UnfriendBtn>Unfriend</UnfriendBtn>
                </CardContentCustom>
            </Card>
        </Container>
    )
}