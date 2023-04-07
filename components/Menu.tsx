import { Avatar } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ContactsIcon from '@mui/icons-material/Contacts';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import Profile from "./Profile/Profile";
import ReactModal from "react-modal";

const initialState = {
    activedChatBtn: false,
    activedContact: false,
}

export default function Menu({ active }: any) {

    const [user] = useAuthState(auth);
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    
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
            router.push('/contacts');
        }
    }

    
    
    return (
        <Container>
            <AvatarButton>
                <UserAvatar src={user?.photoURL!} onClick={() => setIsOpen(true)} />
            </AvatarButton>

            { !activedChatBtn ? 
                <ButtonCustom onClick={onChangeActivedChatBtn}>
                    <ChatIcon fontSize="large"/>
                </ButtonCustom> : 
                <ButtonCustomActive onClick={onChangeActivedChatBtn}>
                    <ChatIcon fontSize="large"/> 
                </ButtonCustomActive> 
            }
            
            { !activedContact ? 
                <ButtonCustom onClick={onChangeActivedContactBtn}>
                    <PeopleAltIcon fontSize="large"/>
                </ButtonCustom> : 
                <ButtonCustomActive onClick={onChangeActivedContactBtn}>
                    <PeopleAltIcon fontSize="large"/> 
                </ButtonCustomActive> 
            }
            
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 70px;
    align-items: center;
    padding: 20px;
    background-color: #0DA3BA;
    height: 100%;
`;

const AvatarButton = styled.button`
    border: none;
    background: #0DA3BA;
    margin-bottom: 2px;
    padding: 4px 0;
`;

const ButtonCustom = styled.button`
    width: 70px;
    padding-top: 15px;
    padding-bottom: 20px;
    border: none;
    cursor: pointer;
    height: 60px;
    color: white;
    background: #0DA3BA;
    :hover {
        opacity: 0.7;
    }
`;

const ButtonCustomActive = styled.button`
    width: 70px;
    padding-top: 15px;
    padding-bottom: 20px;
    border: none;
    cursor: pointer;
    height: 60px;
    color: rgb(4, 110, 148);
    background: rgb(182, 236, 255);
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    width: 50px;
    height: 50px;
    :hover {
        opacity: 0.5;
    }
`;

// const modalStyle: Styles = {
//     content: {
//         width: '400px',
//         textAlign: 'center',
//         margin: '100px auto'
//     }
// }