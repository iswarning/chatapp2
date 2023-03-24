import styled from 'styled-components';
import { Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';
import SearchIcon from '@mui/icons-material/Search';
import * as EmailValidator from 'email-validator';
import { auth, db } from '../firebase';
import { collection, query, where, addDoc, getDocs } from 'firebase/firestore/lite';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import Chat from './Chat';

function Sidebar() {

    // const [user] = useAuthState(auth);

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

        addUserToChatRoom(input);

        console.log(chatData);
        
    };

    const addUserToChatRoom = (input: string) => {
        if(EmailValidator.validate(input) && input !== user?.email) { 
            const docsQuery = query(collection(db, "chats"), where("users", 'array-contains', input));
            getDocs(docsQuery).then((doc) => {
                if(doc.empty) {
                    addDoc(collection(db, "chats"),{
                        users: [user?.email, input]
                    });
                    let chatData = JSON.parse(localStorage.getItem('listChat') || '');
                    chatData.push({ users: [user?.email, input] });
                    localStorage.setItem('listChat', JSON.stringify(chatData));
                    getListChat(); 
                }
            }).catch((err) => console.log(err));
        }
    }

    return (
        <Container>
            <Header>
                <UserAvatar onClick={() => auth.signOut()} />
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
            
            {chatData.length > 0 ? chatData.map( (chat: any) => 
                <Chat key={chat.id} id={chat.id} users={chat.users} />
            ) : null}
        </Container>
    );
}

export default Sidebar;

const Container = styled.div``;

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