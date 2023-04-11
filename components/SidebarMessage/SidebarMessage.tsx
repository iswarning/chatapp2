import SearchIcon from '@mui/icons-material/Search';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Chat from '../Chat';
import Menu from '../Menu';
import { useEffect, useState } from 'react';
import { ButtonCustom, 
    Container, 
    Header, 
    IconsContainer, 
    MenuContainer, 
    Search, 
    SearchInput, 
    SidebarContainer } from './SidebarMessageStyled';
import getChatByEmail from '@/services/chats/getChatByEmail';
import findChatByKeyWord from '@/services/chats/findChatByKeyWord';

export default function SidebarMessage() {

    const [user] = useAuthState(auth);
    const [searchInput, setSearchInput] = useState('');
    const [chatData, setChatData] = useState([]);
    
    const [chatSnapshotFiltered] = useCollection(
        db
        .collection('chats')
        .where('users', 'array-contains', searchInput)
    )

    const handleSearch = (e: any) => {
        setSearchInput(e.target.value);
        if(searchInput.length >= 3) {
            let result = chatData.filter((chat: any) => {
                return chat.data().users.indexOf(e.target.value) !== -1
            });
            console.log(result);
            setChatData(result);
        }
    }

    useEffect(() => {
        getChatByEmail(user?.email!).then((u: any) => setChatData(u))
    },[chatData])

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
                    <SearchInput placeholder='Find in chats' value={searchInput} onChange={handleSearch}/>
                </Search>
                { 
                    chatData.length > 0 ? chatData.map( (chat:any) => 
                        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                    ) : null 
                }
            </SidebarContainer>
        </Container>
    );
}

