import { useEffect, useState } from "react";
import Menu from "../Menu/Menu";
import { Container, FixedMenu, ItemContainer, IconsContainer, MainContent, MenuContainer, SidebarContainer, TextItem, IconsContainerActive, ItemContainerActive } from "./SidebarContactStyled";
import FriendsListScreen from "../FriendsListScreen/FriendsListScreen";
import GroupListScreen from "../GroupListScreen/GroupListScreen";
import GroupsIcon from '@mui/icons-material/Groups';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ListIcon from '@mui/icons-material/List';
import FriendRequestsListScreen from "../FriendRequestsListScreen/FriendRequestsListScreen";
import { io } from "socket.io-client";
import { useRouter } from "next/router";

const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!)

export default function SidebarContact() {

    const [selectedContact, setSelectedContact] = useState('');
    const router = useRouter();

    return (
        <Container>
            <FixedMenu>
                <MenuContainer>
                    <Menu active='Contact' />
                </MenuContainer>
                <SidebarContainer>
                    { selectedContact === 'Friend Requests' ? 
                        <ItemContainerActive >
                            <IconsContainerActive>
                                <PersonAddIcon />
                            </IconsContainerActive>
                            <TextItem>&nbsp; Request Add Friend</TextItem>
                        </ItemContainerActive>
                    : 
                        <ItemContainer onClick={() => setSelectedContact('Friend Requests')}>
                            <IconsContainer>
                                <PersonAddIcon />
                            </IconsContainer>
                            <TextItem>&nbsp; Request Add Friend</TextItem>
                        </ItemContainer>
                    }
                    { selectedContact === 'All friends' ? 
                        <ItemContainerActive >
                            <IconsContainerActive>
                                <ListIcon />
                            </IconsContainerActive>
                            <TextItem>&nbsp; List friends</TextItem>
                        </ItemContainerActive>
                    : 
                        <ItemContainer onClick={() => setSelectedContact('All friends')}>
                            <IconsContainer>
                                <ListIcon />
                            </IconsContainer>
                            <TextItem>&nbsp; List friends</TextItem>
                        </ItemContainer>
                    }
                    { selectedContact === 'Groups' ? 
                        <ItemContainerActive>
                            <IconsContainerActive>
                                <GroupsIcon />
                            </IconsContainerActive>
                            <TextItem>&nbsp; List Group Chat</TextItem>
                        </ItemContainerActive>
                    : 
                        <ItemContainer onClick={() => setSelectedContact('Groups')}>
                            <IconsContainer>
                                <GroupsIcon />
                            </IconsContainer>
                            <TextItem>&nbsp; List Group Chat</TextItem>
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