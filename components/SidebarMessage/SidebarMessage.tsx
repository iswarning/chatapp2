import SearchIcon from '@mui/icons-material/Search';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Chat from '../Chat';
import Menu from '../Menu';
import { useEffect, useState } from 'react';
import { 
    Container, 
    Header, 
    IconsContainer, 
    MenuContainer, 
    Search, 
    SearchInput, 
    SidebarContainer } from './SidebarMessageStyled';
import getChatByEmail from '@/services/chats/getChatByEmail';
import { IconButton } from '@mui/material';
import createNewChat from '@/services/chats/createNewChat';

export default function SidebarMessage() {

    const [user] = useAuthState(auth);
    const [searchInput, setSearchInput] = useState('');
    const [chatData, setChatData] = useState([]);
    const [searchData, setSearchData]: any = useState([]);
    const [recipientEmail, setRecipientEmail] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        getChatByEmail(user?.email!).then((u: any) => setChatData(u));
    },[chatData])
    
    const [chatSnapshotFiltered] = useCollection(
        db
        .collection('chats')
        .where('users', 'array-contains', searchInput)
    )

    const handleSearch = (e: any) => {
        setSearchInput(e.target.value);
        if(searchInput.length >= 3) {
            setChatData(chatData.filter((chat: any) => 
                chat.data().users[1].indexOf(e.target.value) > -1
            ));
        }
    }

    const newChat = () => {
        try {
            createNewChat(user?.email!, recipientEmail, user?.photoURL!)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Container>
            <MenuContainer>
                <Menu active='Chat' />
            </MenuContainer>
            <SidebarContainer>
                <Header>
                    <IconsContainer>
                        <IconButton >
                            <AddIcon titleAccess='New Chat' onClick={() => setIsOpen(!isOpen)}/>
                        </IconButton>
                        <IconButton>
                            <GroupAddIcon titleAccess='New Group'/>
                        </IconButton>
                    </IconsContainer>
                </Header>
                <Search>
                    <SearchIcon />
                    <SearchInput placeholder='Find in chats' value={searchInput} onChange={handleSearch}/>
                </Search>
                { 
                    chatData?.length > 0 ? chatData.map( (chat:any) => 
                        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                    ) : null 
                }
            </SidebarContainer>
            {/* <ModalContainer isOpen={isOpen} onRequestClose={() => setIsOpen(!isOpen)}>
                    <EnterEmailInput type='text' />
            </ModalContainer> */}
        </Container>
    );
}

