import { useEffect, useState } from "react";
import Menu from "../Menu";
import { Container, FixedMenu, ItemContainer, IconsContainer, MainContent, MenuContainer, SidebarContainer, TextItem, IconsContainerActive, ItemContainerActive } from "./SidebarContactStyled";
import FriendsListScreen from "../FriendsListScreen/FriendsListScreen";
import GroupListScreen from "../GroupListScreen/GroupListScreen";
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ListIcon from '@mui/icons-material/List';
import FriendRequestsListScreen from "../FriendRequestsListScreen/FriendRequestsListScreen";

export default function SidebarContact() {

    const [selectedContact, setSelectedContact] = useState('');

    return (
        <Container>
            <FixedMenu>
                <MenuContainer>
                    <Menu active='Contact' />
                </MenuContainer>
                <SidebarContainer>
                    { selectedContact === 'Friend Requests' ? 
                        <ItemContainerActive onClick={() => setSelectedContact('Friend Requests')}>
                            <IconsContainerActive>
                                <PersonAddIcon />
                            </IconsContainerActive>
                            <TextItem>&nbsp; Lời mời kết bạn</TextItem>
                        </ItemContainerActive>
                    : 
                        <ItemContainer onClick={() => setSelectedContact('Friend Requests')}>
                            <IconsContainer>
                                <PersonAddIcon />
                            </IconsContainer>
                            <TextItem>&nbsp; Lời mời kết bạn</TextItem>
                        </ItemContainer>
                    }
                    { selectedContact === 'All friends' ? 
                        <ItemContainerActive onClick={() => setSelectedContact('All friends')}>
                            <IconsContainerActive>
                                <ListIcon />
                            </IconsContainerActive>
                            <TextItem>&nbsp; Bạn bè</TextItem>
                        </ItemContainerActive>
                    : 
                        <ItemContainer onClick={() => setSelectedContact('All friends')}>
                            <IconsContainer>
                                <ListIcon />
                            </IconsContainer>
                            <TextItem>&nbsp; Bạn bè</TextItem>
                        </ItemContainer>
                    }
                    { selectedContact === 'Groups' ? 
                        <ItemContainerActive onClick={() => setSelectedContact('Groups')}>
                            <IconsContainerActive>
                                <GroupsIcon />
                            </IconsContainerActive>
                            <TextItem>&nbsp; Nhóm chat</TextItem>
                        </ItemContainerActive>
                    : 
                        <ItemContainer onClick={() => setSelectedContact('Groups')}>
                            <IconsContainer>
                                <GroupsIcon />
                            </IconsContainer>
                            <TextItem>&nbsp; Nhóm chat</TextItem>
                        </ItemContainer>
                    }
                </SidebarContainer>
            </FixedMenu>
            <MainContent>
                { (selectedContact.length > 0 && selectedContact === 'Friend Requests') ? <FriendRequestsListScreen /> : null }
                { (selectedContact.length > 0 && selectedContact === 'All friends') ? <FriendsListScreen /> : null }
                { (selectedContact.length > 0 && selectedContact === 'Groups') ? <GroupListScreen /> : null }
            </MainContent>
        </Container>
    )
}