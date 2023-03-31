import Menu from "@/components/Menu";
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SearchIcon from '@mui/icons-material/Search';
import { ButtonCustom, 
    Container, 
    Header, 
    HorizontalLine, 
    IconsContainer, 
    MenuContainer, 
    Search, 
    SearchInput, 
    SidebarContainer } from "./ListFriendStyled";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { useState } from "react";
import Friend from "@/components/Friend/Friend";
import { findFriendByKeyWord, getAllFriendCurrentUser } from "@/services/FriendService";

export default function ListFriend() {

    const [user] = useAuthState(auth);
    const [searchInput, setSearchInput] = useState('');

    const friendSnapshot = getAllFriendCurrentUser(user?.uid);

    const friendSnapshotFiltered = findFriendByKeyWord(searchInput, user?.uid);

// users {
//     email: ''
//     friends: [
//         {
//             userId:
//             email:
//         },
//         {
//             userId:
//             email:
//         }
//     ]
// }

// requests_add_friend {
//     senderEmail,
//     recipientEmail,
//     isAccept,
//     isCancel
// }

    return (
        <Container>
            <MenuContainer>
                <Menu active='ListFriendAndGroup' />
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
                    <SearchInput placeholder='Find in friends' value={searchInput} onChange={(e) => setSearchInput(e.currentTarget.value)}/>
                </Search>
                <HorizontalLine />
                { 
                    (searchInput.length < 3 && friendSnapshot !== undefined) ? friendSnapshot?.map( friend => 
                        <Friend key={friend.id} userId={friend.data().userId} email={friend.data().email}/>
                    ) : null 
                }
                {
                    (searchInput.length >= 3 && friendSnapshotFiltered !== undefined) ? friendSnapshotFiltered?.map( friend => 
                        <Friend key={friend.id} userId={friend.data().userId} email={friend.data().email}/>
                    ) : null
                }
            </SidebarContainer>
        </Container>
    )
}


