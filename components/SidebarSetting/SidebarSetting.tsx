import { useState } from "react";
import Menu from "../Menu";
import { Container, FixedMenu, IconsContainer, IconsContainerActive, ItemContainer, ItemContainerActive, MainContent, MenuContainer, SidebarContainer, TextItem } from "../SidebarContact/SidebarContactStyled";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import Profile from "../Profile/Profile";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import AppSettingsScreen from "../AppSettingsScreen/AppSettingsScreen";

function SidebarSetting() {

    const [selectedSetting, setSelectedSetting] = useState('');

    const [user] = useAuthState(auth);

    return (
        <Container>
            <FixedMenu>
                <MenuContainer>
                    <Menu active='Setting' />
                </MenuContainer>
                <SidebarContainer>
                    { selectedSetting === 'My Profile' ? 
                        <ItemContainerActive onClick={() => setSelectedSetting('My Profile')}>
                            <IconsContainerActive>
                                <AccountCircleIcon />
                            </IconsContainerActive>
                            <TextItem>&nbsp; My Profile</TextItem>
                        </ItemContainerActive>
                    : 
                        <ItemContainer onClick={() => setSelectedSetting('My Profile')}>
                            <IconsContainer>
                                <AccountCircleIcon />
                            </IconsContainer>
                            <TextItem>&nbsp; My Profile</TextItem>
                        </ItemContainer>
                    }
                    { selectedSetting === 'App Settings' ? 
                        <ItemContainerActive onClick={() => setSelectedSetting('App Settings')}>
                            <IconsContainerActive>
                                <SettingsIcon />
                            </IconsContainerActive>
                            <TextItem>&nbsp; App Settings</TextItem>
                        </ItemContainerActive>
                    : 
                        <ItemContainer onClick={() => setSelectedSetting('App Settings')}>
                            <IconsContainer>
                                <SettingsIcon />
                            </IconsContainer>
                            <TextItem>&nbsp; App Settings</TextItem>
                        </ItemContainer>
                    }
                </SidebarContainer>
            </FixedMenu>
            <MainContent>
                { selectedSetting == 'My Profile' ? <Profile userInfo={user} /> : null }
                { selectedSetting == 'App Settings' ? <AppSettingsScreen /> : null }
            </MainContent>
        </Container>
    )
}

export default SidebarSetting;