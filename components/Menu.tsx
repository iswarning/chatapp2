import { Avatar } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import styled from "styled-components";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ReactModal, { Styles } from "react-modal";
import Profile from "./Profile";

const initialState = {
    activedProfileBtn: false,
    activedChatBtn: false,
    activedListFriendAndGroupBtn: false,
    activedListAddFriendBtn: false,
    activedManageAccountsBtn: false,
}

export default function Menu() {

    const [user] = useAuthState(auth);
    const [isOpen, setIsOpen] = useState(false);
    
    const [ 
        { activedChatBtn, 
        activedListFriendAndGroupBtn, 
        activedListAddFriendBtn, 
        activedManageAccountsBtn }
        , setState ] = useState(initialState);

    const clearState = () => {
        setState({ ...initialState });
    }

    useEffect(() => {
        setState(prevState => ({ ...prevState, activedChatBtn: true }));
    },[])

    const onChangeActivedChatBtn = () => {
        if (!activedChatBtn) {
            clearState();
            setState(prevState => ({ ...prevState, activedChatBtn: !activedChatBtn }));
        }
    }

    const onChangeActivedListFriendAndGroupBtn = () => {
        if (!activedListFriendAndGroupBtn) {
            clearState();
            setState(prevState => ({ ...prevState, activedListFriendAndGroupBtn: !activedListFriendAndGroupBtn }));
        }
    }

    const onChangeActivedListAddFriendBtn = () => {
        if (!activedListAddFriendBtn) {
            clearState();
            setState(prevState => ({ ...prevState, activedListAddFriendBtn: !activedListAddFriendBtn }));
        }
    }

    const onChangeActivedManageAccountsBtn = () => {
        if (!activedManageAccountsBtn) {
            clearState();
            setState(prevState => ({ ...prevState, activedManageAccountsBtn: !activedManageAccountsBtn }));
            setIsOpen(!isOpen);
        }
    }

    const onCloseModal = () => {
        setIsOpen(!isOpen);
        onChangeActivedChatBtn();
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
                onClick={onChangeActivedListFriendAndGroupBtn}
                style={{color: !activedListFriendAndGroupBtn ? "white" : "#00d7c3", background: !activedListFriendAndGroupBtn ? "#008060" : "rgb(69 96 69 / 40%)" }}
            >
                <PeopleIcon fontSize="large"/>
            </ButtonCustom>
            <ButtonCustom
                onClick={onChangeActivedListAddFriendBtn}
                style={{color: !activedListAddFriendBtn ? "white" : "#00d7c3", background: !activedListAddFriendBtn ? "#008060" : "rgb(69 96 69 / 40%)" }}
            >
                <PersonAddIcon fontSize="large"/>
            </ButtonCustom>
            <ButtonCustom
                onClick={onChangeActivedManageAccountsBtn}
                style={{color: !activedManageAccountsBtn ? "white" : "#00d7c3", background: !activedManageAccountsBtn ? "#008060" : "rgb(69 96 69 / 40%)" }}
            >
                <ManageAccountsIcon fontSize="large"/>
            </ButtonCustom>
            
            <ReactModal isOpen={isOpen} onRequestClose={onCloseModal} style={modalStyle}>
                <Profile />
            </ReactModal>
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
`;

const ButtonCustom = styled.button`
    width: 70px;
    padding-top: 20px;
    padding-bottom: 20px;
    border: none;
    cursor: pointer;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    width: 50px;
    height: 50px;
    :hover {
        opacity: 0.8;
    }
`;

const modalStyle: Styles = {
    content: {
        width: '400px',
        textAlign: 'center',
        margin: '100px auto'
    }
}