import { auth, db } from "@/firebase";
import { Avatar } from "@mui/material";
import { useRouter } from "next/router";
import * as EmailValidator from 'email-validator';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { useState } from "react";

export default function User({ id, photoURL, email }: any) {

    const router = useRouter();
    const [userLogged] = useAuthState(auth);
    const [chatId, setChatId] = useState('');

    const [friendSnapshot] = useCollection(
        db.collection('friends').where('users', 'array-contains', id)
    );

    const addFriend = () => {
        db.collection('friends').add({
            users: [userLogged?.uid, id],
        });
    }

    const [chatSnapshot] = useCollection(
        db
        .collection('chats')
        .where('users', 'array-contains', userLogged?.email)
    );

    const createChat = () => {
        if(EmailValidator.validate(email) && email !== userLogged?.email) {
            db.collection('chats').add({
                users: [userLogged?.email, email],
            });
        }    
    };

    const chatAlreadyExists = (): boolean => {
        return !!chatSnapshot?.docs.find(
            (chat: any) => chat.data().users.find(
                (user: any) => user === email)?.length > 0);
    }

    const enterChat = () => {
        if (chatAlreadyExists()) {
            router.push(`/chat/${chatId}`)
        } else {
            createChat();
        }
    }

    return (
        <Container onClick={enterChat}>
            <UserAvatar src={photoURL} />
            <TextEmail style={{marginTop: !router.query.id ? '15px' : ''}}>{email}</TextEmail>
            { !friendSnapshot?.empty ? <AddFriendButton onClick={addFriend}>
                Add friend
            </AddFriendButton>
            : null}
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

const AddFriendButton = styled.button`
    width: 70px;
    position: absolute;
    font-size: 10px;
    margin-left: 200px;
    margin-top: 40px;
    border: none;
    color: white;
    background: #1c7cf8;
    cursor: pointer; 
    border-radius: 5px;
    padding: 2px;
    :hover {
        background: whitesmoke;
        color: purple;
    }
`;

const TextEmail = styled.p`
    
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;