import styled from 'styled-components';
import { Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from 'email-validator';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useEffect, useState } from 'react';
import Chat from './Chat';

function Sidebar() {

    const [user] = useAuthState(auth);
    const userChatRef = db.collection('chats').where('users', 'array-contains', user.email);
    const [chatSnapshot] = useCollection(userChatRef); 
    const [chatData, setChatData] = useState<Array<object>>([]);

    useEffect(() => {
        getListChat();
    },[])

    // storage chat data to firebase
    // const getListChat = () => {
    //     getDocs(collection(db, 'chats'))
    //       .then((querySnapshot) => {
    //             querySnapshot.forEach((doc) => {
    //                 setChatData([...chatData, doc.data()]);
    //             });
    //         })
    //       .catch((error) => {
    //             console.log('Error getting documents: ', error);
    //         });
    // }

    // storage chat data to local storage
    const getListChat = () => {
        if(localStorage.getItem('listChat') === null) {
            localStorage.setItem('listChat', JSON.stringify([]))
        } else { 
            setChatData(JSON.parse(localStorage.getItem('listChat') || ''))
        }
    }

    const createChat = async () => {
        const input = prompt(
            "Please enter an email address for the user you wish to chat with"
        );

        if (!input) return null;

        if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user?.email) {
            db.collection('chats').add({
                users: [user?.email, input]
            });
        }

        console.log(chatData);
        
    };

    const chatAlreadyExists = (recipientEmail: string): boolean => {
        return !!chatSnapshot?.docs.find(
            (chat: any) => chat.data().users.find(
                (user: any) => user === recipientEmail)?.length > 0);
    }

    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={() => auth.signOut()} />
                <IconsContainer>
                    <IconButton>
                        <ChatIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </IconsContainer>
            </Header>
            <Search>
                <SearchIcon />
                <SearchInput placeholder='Search in chats' />
            </Search>
            <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>
            
            {chatSnapshot ? chatData.map( (chat: any) => 
                <Chat key={chat.id} id={chat.id} users={chat.users} />
            ) : null}
        </Container>
    );
}

export default Sidebar;

const Container = styled.div`
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

const UserAvatar = styled(Avatar)`
    cursor: pointer;

    :hover {
        opacity: 0.8;
    }
`;

const IconsContainer = styled.div``;