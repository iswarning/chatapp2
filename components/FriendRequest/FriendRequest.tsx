import { db } from "@/firebase";
import { CardContentCustom, Container, AcceptBtn, CancelBtn } from "./FriendRequestStyled";
import { useState } from "react";
import { Card, CardMedia, Typography } from "@mui/material";

function FriendRequest({ userId, email, calledComponent }: any) {

    const [userById, setUserById]: any = useState();

    db.collection('users').doc(userId).get().then((u) => {
        setUserById(u.data());
    });

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
                    Dragon
                    </Typography>
                    <AcceptBtn>Accept</AcceptBtn>
                    <CancelBtn>Cancel</CancelBtn>
                </CardContentCustom>
            </Card>
        </Container>
    )
}

export default FriendRequest;