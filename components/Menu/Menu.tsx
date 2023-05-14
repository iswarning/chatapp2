import ChatIcon from '@mui/icons-material/Chat';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import { AvatarButton, ButtonCustom, ButtonCustomActive, Container, LogoutBtn, UserAvatar } from "./MenuStyled";

const initialState = {
    activedChatBtn: false,
    activedContactBtn: false,
    activedUserBtn: false,
    activedSettingBtn: false,
}

export default function Menu({ active }: any) {

    const [user] = useAuthState(auth);
    const router = useRouter();
    
    const [ 
        { activedChatBtn, 
        activedContactBtn,
        activedUserBtn,
        activedSettingBtn, }
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
            case 'User':
                onChangeActivedUserBtn()
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
            console.log(user?.photoURL);
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

    const onChangeActivedUserBtn = () => {
        if (!activedUserBtn) {
            clearState();
            setState(prevState => ({ ...prevState, activedUserBtn: !activedUserBtn }));
            if(router.asPath.indexOf('/users/') === -1) {
                router.push('/users');
            }
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

            { !activedUserBtn ? 
                <ButtonCustom onClick={onChangeActivedUserBtn}>
                    <PersonSearchIcon fontSize="large" titleAccess="Search User"/>
                </ButtonCustom> : 
                <ButtonCustomActive onClick={onChangeActivedUserBtn}>
                    <PersonSearchIcon fontSize="large" titleAccess="Search User"/> 
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

