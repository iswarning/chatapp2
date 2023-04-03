import { Avatar } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ContactsIcon from '@mui/icons-material/Contacts';

const initialState = {
    activedChatBtn: false,
    activedContact: false,
}

export default function Menu({ active }: any) {

    const [user] = useAuthState(auth);
    const router = useRouter();
    
    const [ 
        { activedChatBtn, 
        activedContact }
        , setState ] = useState(initialState);

    const clearState = () => {
        setState({ ...initialState });
    }

    useEffect(() => {
        switch(active){
            case 'Chat':
                onChangeActivedChatBtn();
                break;
            case 'Contact':
                onChangeActivedContactBtn()
                break;
            default:
                onChangeActivedChatBtn();
                break;
        }
    },[])

    const onChangeActivedChatBtn = () => {
        if (!activedChatBtn && active.length > 0) {
            clearState();
            setState(prevState => ({ ...prevState, activedChatBtn: !activedChatBtn }));
            if(router.asPath.indexOf('/chat/') === -1) {
                router.push('/');
            }
        }
    }

    const onChangeActivedContactBtn = () => {
        if (!activedContact && active.length > 0) {
            clearState();
            setState(prevState => ({ ...prevState, activedContact: !activedContact }));
            router.push('/friends');
        }
    }
    
    return (
        <Container>
            <AvatarButton>
                <UserAvatar src={user?.photoURL!} onClick={() => auth.signOut()} />
            </AvatarButton>
            <ButtonCustom
                onClick={onChangeActivedChatBtn}
                style={{color: !activedChatBtn ? "white" : "#00d7c3", background: !activedChatBtn ? "#008060" : "rgb(69 96 69 / 40%)" }}
            >
                <ChatIcon fontSize="large"/>
            </ButtonCustom>
            <ButtonCustom
                onClick={onChangeActivedContactBtn}
                style={{color: !activedContact ? "white" : "#00d7c3", background: !activedContact ? "#008060" : "rgb(69 96 69 / 40%)" }}
            >
                <ContactsIcon fontSize="large"/>
            </ButtonCustom>
            
            {/* <ReactModal isOpen={isOpen} onRequestClose={onCloseModal} style={modalStyle}>
                <Profile />
            </ReactModal> */}
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 70px;
    align-items: center;
    padding: 20px;
    background-color: #008060;
    height: 100%;
`;

const AvatarButton = styled.button`
    border: none;
    padding: 10px;
    background: #008060;
    margin: 0;
    padding: 4px 0;
`;

const ButtonCustom = styled.button`
    width: 70px;
    padding-top: 15px;
    padding-bottom: 20px;
    border: none;
    cursor: pointer;
    height: 60px;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    width: 50px;
    height: 50px;
    :hover {
        opacity: 0.8;
    }
`;

// const modalStyle: Styles = {
//     content: {
//         width: '400px',
//         textAlign: 'center',
//         margin: '100px auto'
//     }
// }