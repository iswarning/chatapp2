import { auth, db } from "@/firebase";
import getRecipientEmail from "@/utils/getRecipientEmail";
import { Avatar } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";

export default function User(id: string) {

    const router = useRouter();
    const [user, setUser] = useState({}); 

    useEffect(() => {
        getUserById();
    },[])

    const getUserById = () => {
        db.collection('users').doc(id).get().then((u: any) => {
            setUser(u);
        });
    }

    const enterChat = () => {
        router.push(`/chat/${id}`)
    }

    return (
        <Container onClick={enterChat}>
            {recipient ? (
                <UserAvatar src={user} />
            ): (
                <UserAvatar>{recipientEmail[0]}</UserAvatar>
            )}
            <TextEmail>{recipientEmail}</TextEmail>
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;

    :hover {
        background-color: #e9eaeb;
    }
`;

const TextEmail = styled.p`
    
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;