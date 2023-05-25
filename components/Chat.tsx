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
    const [lastMessage, setLastMessage] = useState('This is Messagesssssssssssssssssssssssssssssssssssssssssssssssssssssssss')

    useEffect(() => {
        getUserInfo().catch((err) => console.log(err));
        handleMessageTooLong();
    },[])

    const getUserInfo = async() => {
        const info = await getUserByEmail(getRecipientEmail(data.users, user));
        setRecipientUser(info.data());
    }

    const handleMessageTooLong = () => {
        if(lastMessage.length > 25) {
            setLastMessage(lastMessage.substring(0, 25) + "...");
        }
    }

    return (
        <>
            {
                data.isGroup ? 
                <UserContainer onClick={() => onShowMessage()} style={{backgroundColor: active ? '#e9eaeb' : ''}}>
                    <UserAvatar src={data.photoURL}/>
                    <ContainerText>
                        <TextEmail>Group: {data.name}</TextEmail>
                        <TextMess>{lastMessage}</TextMess>
                    </ContainerText>
                    <Dot>&#x2022;</Dot>
                </UserContainer>
                : 
                <UserContainer onClick={() => onShowMessage()} style={{backgroundColor: active ? '#e9eaeb' : ''}}>
                    <UserAvatar src={recipientUser.photoURL}/>
                    <ContainerText>
                        <TextEmail>{recipientUser.fullName}</TextEmail>
                        <TextMess>{lastMessage}</TextMess>
                    </ContainerText>
                    <Dot>&#x2022;</Dot>
                </UserContainer>
            }
        </>
    )

}

const Dot = styled.span`
    font-size: 30px;
    color: #0DA3BA;
    margin-left: auto;
`

const ContainerText = styled.div`
    display: flex;
    flex-direction: column;
`

const TextMess = styled.span`
    font-size: 14px;
    color: black;
    font-weight: 500;
    text-overflow: ellipsis
`

const TextEmail = styled.span`
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 10px;
    width: 50px;
    height: 50px;
`;

const UserContainer = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;
    height: 80px;
    :hover {
        background-color: #e9eaeb;
    }
`;