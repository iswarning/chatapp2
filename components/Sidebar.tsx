import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from 'email-validator';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Chat from './Chat';
import Menu from './Menu';
import { useState } from 'react';
import User from './User';

function Sidebar() {

    const [user] = useAuthState(auth);
    const [searchInput, setSearchInput] = useState('');
    const userChatRef = db.collection('chats').where('users', 'array-contains', user?.email);
    const [chatSnapshot] = useCollection(userChatRef); 
    const [userSnapshotFiltered] = useCollection(
        db.collection('users').where('email','==',searchInput)
    );
    
    const createChat = () => {
        const input = prompt(
            "Please enter an email address for the user you wish to chat with"
        );

        if (!input) return null;

        if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user?.email) {
            db.collection('chats').add({
                users: [user?.email, input],
                isGroup: false,
            });
        }    
    };

    const createNewFriend = (recipientId: string) => {
        db.collection('friends').add({
            users: [user?.uid, recipientId],
            isAccept: false,
            isUnFriend: false,
            isBlocked: false,
        })
    }

    const chatAlreadyExists = (recipientEmail: string): boolean => {
        return !!chatSnapshot?.docs.find(
            (chat: any) => chat.data().users.find(
                (user: any) => user === recipientEmail)?.length > 0);
    }

    const handleSearch = () => {
        if(searchInput.length >= 3) {

        }
    }

    // const createNewGroup = () => {

    // }

    return (
        <Container>
            <MenuContainer>
                <Menu />
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
                    <SearchInput placeholder='Enter at least 3 characters to search' value={searchInput} onChange={handleSearch}/>
                </Search>
                <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>
                { 
                    (searchInput.length < 3) ? chatSnapshot?.docs.map( (chat: any) => 
                        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
                    ) : null 
                }
                {
                    (searchInput.length >= 3 && !userSnapshotFiltered?.empty) ? userSnapshotFiltered?.docs.map( (user) => 
                        <User key={user.id} id={user.id} />
                    ) : null
                }
            </SidebarContainer>
        </Container>
    );
}

export default Sidebar;

const ButtonCustom = styled.a`
    cursor: pointer;
    color: rgba(0, 0, 0, 0.54);
    :hover {
        color: #00d7c3;
    }
    padding: 5px;
`;

const MenuContainer = styled.div``;

const Container = styled.div`
    display: flex;
`;

const SidebarContainer = styled.div`
    flex: 0.45s;
    border-right: 1px solid whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
`;

const SidebarButton = styled.button`
    width: 100%;
    &&& {
        border-top: 1px solid whitesmoke;
        border-bottom: 1px solid whitesmoke;
    }
`;

const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`;

const Header = styled.div`
    display: flex;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;

const IconsContainer = styled.div``;