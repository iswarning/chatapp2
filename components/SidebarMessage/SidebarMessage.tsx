import SearchIcon from '@mui/icons-material/Search';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Chat from '../Chat';
import Menu from '../Menu/Menu';
import { useEffect, useState } from 'react';
import { 
    ChatContainer,
    Container, 
    Header, 
    IconsContainer, 
    MenuContainer, 
    ModalContainer, 
    Search, 
    SearchInput, 
    SidebarContainer} from './SidebarMessageStyled';
import getChatByEmail from '@/services/chats/getChatByEmail';
import { IconButton } from '@mui/material';
import CreateGroupScreen from '../CreateGroupScreen/CreateGroupScreen';
import getMessagesByChatId from '@/services/messages/getMessagesByChatId';
import ChatScreen from '../ChatScreen/ChatScreen';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function SidebarMessage() {

    const [user] = useAuthState(auth);
    const [searchInput, setSearchInput] = useState('');
    const [chatData, setChatData]: any = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [messData, setMessData]: any = useState(null);
    const [chatInfo, setChatInfo]: any = useState({});
    const [chatSnapshot] = useCollection(
        db
        .collection("chats")
    )

    useEffect(() => {
        // getListChat().catch((err) => console.log(err))
    },[])

    // const handleSearch = (e: any) => {
    //     setSearchInput(e.target.value);
    //     if(searchInput.length >= 3) {
    //         setChatData(chatData.filter((chat: any) => 
    //             chat.data().users[1].indexOf(e.target.value) > -1
    //         ));
    //     }
    // }
    
    // const getListChat = async() => {
    //     const chatByEmail = await getChatByEmail(user?.email!);
    //     setChatData(chatByEmail);
    // }

    // const onClose = async() => {
    //     setIsOpen(false);
    //     await getListChat();
    // }

    // const showMessages = async(chat: any) => {
    //     setChatInfo(chat);
    //     await getMessageData(chatInfo.id);
    // }

    // const getMessageData = async(chatId: string) => {
    //     const messages = await getMessagesByChatId(chatId);
    //     if(messages.length > 0) {
    //         setMessData(messages);
    //     } else {
    //         setMessData([])
    //     }
    // }

    return (
        // <Container>
        //     <MenuContainer>
        //         <Menu active='Chat' />
        //     </MenuContainer>
        //     <SidebarContainer>
        //         <Header>
        //             <IconsContainer onClick={() => setIsOpen(true)}>
        //                 <IconButton>
        //                     <GroupAddIcon titleAccess='Create Group Chat'/>
        //                 </IconButton>
        //             </IconsContainer>
        //         </Header>
        //         <Search>
        //             <SearchIcon />
        //             <SearchInput placeholder='Search' value={searchInput} onChange={handleSearch}/>
        //         </Search>
        //         {
        //             chatData?.length > 0 ? chatData.map((chat:any) => 
        //                 <Chat 
        //                     key={chat.id} 
        //                     id={chat.id} 
        //                     data={chat.data()} 
        //                     onShowMessage={() => showMessages(chat)} 
        //                     />
        //             ) : null
        //         }
        //     </SidebarContainer>
        //     {
        //         messData ? 
        //             <ChatContainer>
        //                 <ChatScreen chatId={chatInfo.id} chat={chatInfo.data()} messages={messData} onReloadMessage={() => getMessageData(chatInfo.id)}/>
        //             </ChatContainer>
        //         : null
        //     }
        //     <ModalContainer isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
        //         <CreateGroupScreen onClose={onClose}/>
        //     </ModalContainer>
        // </Container>
        <div className="sidebar hidden lg:flex w-1/3 flex-2 flex-col pr-6" >
            <div className="search flex-2 pb-6 px-2">
                <input type="text" className="outline-none py-2 block w-full bg-transparent border-b-2 border-gray-200" placeholder="Search"/>
            </div>
            <div className="flex-1 overflow-y-scroll h-screen p-2"  id="scroll-style-3">
                {
                    chatSnapshot?.docs?.length! > 0 ? chatSnapshot?.docs?.map((chat) => 
                         <Chat 
                            key={chat.id} 
                            chat={{
                                id: chat.id,
                                ...chat.data()
                            }} 
                            />
                    ) : null
                }
            </div>
        </div>
    );
}

