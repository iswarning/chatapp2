import { auth, db } from "@/firebase";
import getRecipientEmail from "@/utils/getRecipientEmail";
import { Avatar } from "@mui/material";
import { getDocs, query, collection,where, deleteDoc } from "firebase/firestore/lite";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";

export default function Chat({ id, users }: any) {

    const [user] = useAuthState(auth);
    const [recipientCurrent,setRecipientCurrent] = useState<any>({});
    const recipient = getDocs(query(collection(db, "users"), where("email", '==', getRecipientEmail({users, user}))));
    recipient.then(res => setRecipientCurrent((res.docs?.[0]).data()));
    
    const recipientEmail = getRecipientEmail({users, user});

    return (
        <Container>
            {recipientCurrent ? (
                <UserAvatar src={recipientCurrent.photoURL} />
            ): (
                <UserAvatar>{recipientEmail[0]}</UserAvatar>
            )}
            <p>{recipientEmail}</p>
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

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;