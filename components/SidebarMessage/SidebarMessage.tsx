import SearchIcon from '@mui/icons-material/Search';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
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
import ReactModal from 'react-modal';
import styled from '@emotion/styled';
import AddUserToGroupScreen from '../AddUserToGroupScreen/AddUserToGroupScreen';

export default function SidebarMessage() {

    const [user] = useAuthState(auth);
    const [searchInput, setSearchInput] = useState('');
    const [chatData, setChatData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        getChatByEmail(user?.email!).then((u: any) => setChatData(u));
    },[])

    const handleSearch = (e: any) => {
        setSearchInput(e.target.value);
        if(searchInput.length >= 3) {
            setChatData(chatData.filter((chat: any) => 
                chat.data().users[1].indexOf(e.target.value) > -1
            ));
        }
    }

    const onNewGroupChat = () => {

    }

    return (
        <Container>
            <MenuContainer>
                <Menu active='Chat' />
            </MenuContainer>
            <SidebarContainer>
                <Header>
                    <IconsContainer onClick={() => setIsOpen(true)}>
                        <IconButton>
                            <GroupAddIcon titleAccess='Tạo nhóm chat'/>
                        </IconButton>
                    </IconsContainer>
                </Header>
                <Search>
                    <SearchIcon />
                    <SearchInput placeholder='Tìm kiếm tin nhắn' value={searchInput} onChange={handleSearch}/>
                </Search>
                { 
                    chatData?.length > 0 ? chatData.map( (chat:any) => 
                        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                    ) : null 
                }
            </SidebarContainer>
            <ModalContainer isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
                <AddUserToGroupScreen />
            </ModalContainer>
        </Container>
    );
}

const ModalContainer = styled(ReactModal)`
    margin-left: auto;
    margin-right: auto;
    margin-top: 100px;
    width: 350px;
    height: 600px;
    background-color: white;
`

