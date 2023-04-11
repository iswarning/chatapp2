import { Avatar } from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';

const initialState = {
    activedChatBtn: false,
    activedContactBtn: false,
    activedSettingBtn: false,
}

export default function Menu({ active }: any) {

    const [user] = useAuthState(auth);
    const router = useRouter();
    
    const [ 
        { activedChatBtn, 
        activedContactBtn,
        activedSettingBtn }
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
            case 'Setting':
                onChangeActivedSettingBtn()
                break;
            default:
                onChangeActivedChatBtn();
                break;
        }
    },[])

    const onChangeActivedChatBtn = () => {
        if (!activedChatBtn) {
            clearState();
            setState(prevState => ({ ...prevState, activedChatBtn: !activedChatBtn }));
            if(router.asPath.indexOf('/chat/') === -1) {
                router.push('/');
            }
        }
    }

    const onChangeActivedContactBtn = () => {
        if (!activedContactBtn) {
            clearState();
            setState(prevState => ({ ...prevState, activedContactBtn: !activedContactBtn }));
            router.push('/contacts');
        }
    }

    const onChangeActivedSettingBtn = () => {
        if (!activedSettingBtn) {
            clearState();
            setState(prevState => ({ ...prevState, activedSettingBtn: !activedSettingBtn }));
            router.push('/settings');
        }
    }
    
    return (
        <Container>
            <AvatarButton>
                <UserAvatar src={user?.photoURL!} />
            </AvatarButton>

            { !activedChatBtn ? 
                <ButtonCustom onClick={onChangeActivedChatBtn}>
                    <ChatIcon fontSize="large" titleAccess="Messages"/>
                </ButtonCustom> : 
                <ButtonCustomActive onClick={onChangeActivedChatBtn}>
                    <ChatIcon fontSize="large" titleAccess="Messages"/> 
                </ButtonCustomActive> 
            }
            
            { !activedContactBtn ? 
                <ButtonCustom onClick={onChangeActivedContactBtn}>
                    <PeopleAltIcon fontSize="large" titleAccess="Contacts"/>
                </ButtonCustom> : 
                <ButtonCustomActive onClick={onChangeActivedContactBtn}>
                    <PeopleAltIcon fontSize="large" titleAccess="Contacts"/> 
                </ButtonCustomActive> 
            }

            { !activedSettingBtn ? 
                <ButtonCustom onClick={onChangeActivedSettingBtn}>
                    <ManageAccountsIcon fontSize="large" titleAccess="Settings"/>
                </ButtonCustom> : 
                <ButtonCustomActive onClick={onChangeActivedSettingBtn}>
                    <ManageAccountsIcon fontSize="large" titleAccess="Settings"/> 
                </ButtonCustomActive> 
            }

            <LogoutBtn onClick={() => auth.signOut()}>
                <PowerSettingsNewIcon fontSize="large" titleAccess="Logout"/>
            </LogoutBtn>

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

const LogoutBtn = styled(ButtonCustom)`
    margin-top: auto;
`;