import { auth, db } from "@/firebase";
import getRecipientEmail from "@/utils/getRecipientEmail";
import { Avatar } from "@mui/material";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import * as EmailValidator from 'email-validator';
import styled from "styled-components";
import getUserByEmail from "@/services/users/getUserByEmail";
import { getRecipientUserName } from "@/utils/getRecipientUserName";

export default function Chat({ id, users }: any) {

    const router = useRouter();
    const [user] = useAuthState(auth);
    const [recipientSnapshot] = useCollection(
        db.collection('users').where('email', '==', getRecipientEmail(users, user))
    );

    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmail = getRecipientEmail(users, user); 

    const [chatSnapshot] = useCollection(
        db
        .collection('chats')
        .where('users', 'array-contains', user?.email)
    );

    const createChat = () => {
        if(EmailValidator.validate(recipientEmail) && recipientEmail !== user?.email) {
            db.collection('chats').add({
                users: [user?.email, recipientEmail],
            });
        }    
    };

    const chatAlreadyExists = (): boolean => {
        return !!chatSnapshot?.docs.find(
            (chat: any) => chat.data().users.find(
                (email: any) => email === recipientEmail)?.length > 0);
    }

    const enterChat = () => {
        if (chatAlreadyExists()) {
            router.push(`/chat/${id}`)
        } else {
            createChat();
        }
    }

    return (
        <>
            {
                router.query.id === id ? <ChatActive onClick={enterChat}>
                    {recipient ? (
                        <UserAvatar src={recipient.photoURL} />
                    ): (
                        <UserAvatar>{getRecipientUserName(recipientEmail[0])}</UserAvatar>
                    )}
                    <TextEmail>{recipientEmail}</TextEmail>
                </ChatActive> : <Container onClick={enterChat}>
                    {recipient ? (
                        <UserAvatar src={recipient.photoURL} />
                    ): (
                        <UserAvatar>{getRecipientUserName(recipientEmail[0])}</UserAvatar>
                    )}
                    <TextEmail>{recipientEmail}</TextEmail>
                </Container>
            }
        </>
    )
}

const Container = styled.div`
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

const ChatActive = styled(Container)`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;
    height: 60px;
    background-color: #e9eaeb;;
`;

const TextEmail = styled.p`
    margin-top: 15px;
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 10px;
`;