import Menu from "@/components/Menu";
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SearchIcon from '@mui/icons-material/Search';
import { ButtonCustom, 
    Container, 
    Header, 
    IconsContainer, 
    ItemContainer, 
    MenuContainer, 
    Search, 
    SearchInput, 
    SidebarContainer, 
    Text} from "./styled";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { useState } from "react";
// import { findFriendByKeyWord, getAllFriendCurrentUser } from "@/services/FriendService";

export default function ListFriend() {

    const [user] = useAuthState(auth);
    const [searchInput, setSearchInput] = useState('');

    // const friendSnapshot = getAllFriendCurrentUser(user?.uid);

    // const friendSnapshotFiltered = findFriendByKeyWord(searchInput, user?.uid);

// users {
//     email: ''
//     friends: [
//         {
//             uid: '',
//             friendsList: [],
//         },
//         {
//             userId:
//         }
//     ]
// }

// db.collection('friends').where('userId1','==',)

// friends {
//     userId1: '',
//     userId2: '',

// }

// requests_add_friend {
//     senderEmail,
//     recipientEmail,
//     isAccept,
//     isCancel
// }

// messages {
//     users: [

//     ],
//     message: '',
//     photoURL: '',
//     sentAt: '',
//     senderEmail: '',
//     isGroup: '',
// }

    // db.collection('users').doc('wrwrwrwrwwr').get().then((u) => {
    //     setSearchInput(u);
    // })

    return (
        <Container>
            <MenuContainer>
                <Menu active='Contact' />
            </MenuContainer>
            <SidebarContainer>
                <ItemContainer>
                    <Text>Friends List</Text>
                </ItemContainer>
                <ItemContainer>
                    <Text>Group List</Text>
                </ItemContainer>
            </SidebarContainer>
        </Container>
    )
}


