import { useEffect, useState } from "react";
import Menu from "../Menu";
import { Container, FixedMenu, ItemContainer, MainContent, MenuContainer, SidebarContainer, TextItem } from "./SidebarContactStyled";
import FriendsListScreen from "../FriendsListScreen/FriendsListScreen";
import GroupListScreen from "../GroupListScreen/GroupListScreen";

export default function SidebarContact() {

    const [selectedContact, setSelectedContact] = useState('');

    return (
        <Container>
            <FixedMenu>
                <MenuContainer>
                    <Menu active='Contact' />
                </MenuContainer>
                <SidebarContainer>
                    <ItemContainer onClick={() => setSelectedContact('Friends List')}>
                        <TextItem>Friends List</TextItem>
                    </ItemContainer>
                    <ItemContainer onClick={() => setSelectedContact('Group List')}>
                        <TextItem>Group List</TextItem>
                    </ItemContainer>
                </SidebarContainer>
            </FixedMenu>
            <MainContent>
                { (selectedContact.length > 0 && selectedContact == 'Friends List') ? <FriendsListScreen /> : null }
                { (selectedContact.length > 0 && selectedContact == 'Group List') ? <GroupListScreen /> : null }
            </MainContent>
        </Container>
    )
}