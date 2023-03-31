import { db } from "@/firebase";
import { Container, TextEmail, UserAvatar } from "./FriendStyled";
import { useState } from "react";

export default function Friend({ userId, email }: any) {

    const [userById, setUserById]: any = useState();

    db.collection('users').doc(userId).get().then((u) => {
        setUserById(u.data());
    });

    return (
        <Container>
            <UserAvatar src={userById?.photoURL} />
            <TextEmail >{email}</TextEmail>
        </Container>
    )
}