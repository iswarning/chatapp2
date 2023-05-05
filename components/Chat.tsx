import { auth } from "@/firebase";
import getUserByEmail from "@/services/users/getUserByEmail";
import getRecipientEmail from "@/utils/getRecipientEmail";
import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";

export default function Chat({ id, data, active, onShowMessage }: any) {

    const [user] = useAuthState(auth);
    const [recipientUser, setRecipientUser]: any = useState({});

    useEffect(() => {
        getUserByEmail(getRecipientEmail(data.users, user)).then((u) => setRecipientUser(u.data()));         
    },[])

    return (
        <>
            {
                data.isGroup ? 
                <UserContainer onClick={() => onShowMessage()} style={{backgroundColor: active ? '#e9eaeb' : ''}}>
                    <UserAvatar src={data.photoURL}/>
                    <TextEmail>{data.name}</TextEmail>
                </UserContainer>
                : 
                <UserContainer onClick={() => onShowMessage()} style={{backgroundColor: active ? '#e9eaeb' : ''}}>
                    <UserAvatar src={recipientUser.photoURL}/>
                    <TextEmail>{recipientUser.fullName}</TextEmail>
                </UserContainer>
            }
        </>
    )
}

const TextEmail = styled.p`
    margin-top: 15px;
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 10px;
`;

const UserContainer = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;
    height: 60px;
    :hover {
        background-color: #e9eaeb;
    }
`;