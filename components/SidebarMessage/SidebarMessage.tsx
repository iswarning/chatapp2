import SearchIcon from '@mui/icons-material/Search';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Chat from '../Chat';
import Menu from '../Menu';
import { useState } from 'react';
import { ButtonCustom, 
    Container, 
    Header, 
    IconsContainer, 
    MenuContainer, 
    Search, 
    SearchInput, 
    SidebarContainer } from './SidebarMessageStyled';

export default function SidebarMessage() {

    const [user] = useAuthState(auth);
    const [searchInput, setSearchInput] = useState('');

    const [chatSnapshot] = useCollection(
        db
        .collection('chats')
        .where('users', 'array-contains', user?.email)
    );
    
    const [chatSnapshotFiltered] = useCollection(
        db
        .collection('chats')
        .where('users', 'array-contains', searchInput)
    )

    return (
        <Container>
            <MenuContainer>
                <Menu active='Chat' />
            </MenuContainer>
            <SidebarContainer>
                <Header>
                    <IconsContainer>
                        <ButtonCustom>
                            <AddIcon/>
                        </ButtonCustom>
                        <ButtonCustom >
                            <GroupAddIcon/>
                        </ButtonCustom>
                    </IconsContainer>
                </Header>
                <Search>
                    <SearchIcon />
                    <SearchInput placeholder='Find in chats' value={searchInput} onChange={(e) => setSearchInput(e.currentTarget.value)}/>
                </Search>
                { 
                    (searchInput.length < 3) ? chatSnapshot?.docs.map( chat => 
                        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                    ) : null 
                }
                {
                    (searchInput.length >= 3 && !chatSnapshotFiltered?.empty) ? chatSnapshotFiltered?.docs.map( chatData => 
                        <Chat key={chatData.id} id={chatData.id} users={chatData.data().users} />
                    ) : null
                }
            </SidebarContainer>
        </Container>
    );
}

