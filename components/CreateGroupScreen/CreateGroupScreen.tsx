import { useEffect, useState } from "react";
import { BtnAdd, BtnBack, BtnContainer, BtnRemove, BtnViewListMember, Container, CountMemberContainer, CountMemberValue, GroupNameContainer, GroupNameInput, Label, ListMemberScreen, Search, SearchInput, SidebarContainer, TextEmail, UserAvatar, UserContainer } from "./CreateGroupScreenStyled";
import SearchIcon from '@mui/icons-material/Search';
import { AcceptBtn } from "../FriendRequest/FriendRequestStyled";
import getAllFriendOfUser from "@/services/friends/getAllFriendOfUser";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import getRecipientEmail from "@/utils/getRecipientEmail";
import getUserByEmail from "@/services/users/getUserByEmail";
import createNewGroupChat from "@/services/chat-groups/createNewGroupChat";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function CreateGroupScreen({onClose}: any) {

    const [searchInput, setSearchInput] = useState('');
    const [groupName, setGroupName] = useState('');
    const [listMember, setListMember]: any = useState([]);
    const [statusView, setStatusView] = useState('viewFriend');
    const [friendData, setFriendData] = useState<Array<any>>();
    const [searchData, setSearchData]: any = useState({});
    const [user] = useAuthState(auth);

    useEffect(() => {
        const getFriendAndUserInfo = async() => {
            let result: Array<any> = [];
            const allFriend = await getAllFriendOfUser(user?.email!);
            if(allFriend.length > 0) { 
                allFriend.forEach(async(f) => {
                    const userByEmail = await getUserByEmail(getRecipientEmail(f.data().users, user));
                    result.push({
                        id: userByEmail.id,
                        email: userByEmail.data().email,
                        phoneNumber: userByEmail.data().phoneNumber,
                        photoURL: userByEmail.data().photoURL,
                    })
                })
            }
            setFriendData(result);
        }
        getFriendAndUserInfo();
        addAdminUserToGroup();
    },[])

    const addAdminUserToGroup = () => setListMember([
        { id: user?.uid, email: user?.email, photoURL: user?.photoURL, phoneNumber: user?.phoneNumber}]);

    const handleSearch = (value: any) => {
        setSearchInput(value);
        if(value.length === 10) {
            const d = friendData?.find((f) => f.phoneNumber === value)
            if(d !== undefined && listMember.length > 0 && listMember.filter((mem: any) => mem.email === d.email).length === 0) { 
                setSearchData(d)
            } else {
                setSearchData({});
            }
        }
    }

    const handleAddUser = (userInfo: any) => {
        setListMember((oldListMember: any) => [
            {
                id: userInfo?.id, 
                email: userInfo?.email, 
                photoURL: userInfo?.photoURL, 
            },
            ...oldListMember
        ]);
    }

    const handleRemoveUser = (mem: any) => {
        setListMember(listMember.filter((m: any) => m.email !== mem.email));
    }

    const handleCreateNewGroupChat = (e: any) => {
        e.preventDefault();
        let members = listMember.map((m: any) => m.email);
        createNewGroupChat(members, '', groupName, user?.email!);
        onClose();
    }

    return (
        <Container>
            <SidebarContainer>
                <Search>
                    <SearchIcon />
                    <SearchInput placeholder='Enter phone number to search' value={searchInput} onChange={(e) => handleSearch(e.currentTarget.value)}/>
                </Search>
                <GroupNameContainer>
                    <GroupNameInput title="Group Name" placeholder=" Enter group name" value={groupName} hidden={listMember?.length! < 3} onChange={(e) => setGroupName(e.target.value)}/>
                </GroupNameContainer>
                <CountMemberContainer>
                    <Label>Total members:</Label>
                    <CountMemberValue>&nbsp; {listMember?.length!}</CountMemberValue>
                    { statusView === 'viewFriend' ? <IconButton style={{marginLeft: 'auto'}} onClick={() => setStatusView('viewListMember')}><VisibilityIcon/></IconButton> : null}
                    { statusView === 'viewListMember' ? <IconButton style={{marginLeft: 'auto'}} onClick={() => setStatusView('viewFriend')}><ArrowBackIcon /></IconButton> : null}
                </CountMemberContainer>
                <ListMemberScreen style={{overflowY: listMember?.length! > 7 && statusView === 'viewListMember' ? 'scroll' : 'unset'}}>
                {   
                    statusView === 'viewFriend' && searchInput.length === 10  && Object.keys(searchData).length > 0 ? 
                        <UserContainer key={searchData?.id}>
                            <UserAvatar src={searchData?.photoURL} />
                            <TextEmail>{searchData?.phoneNumber}</TextEmail>
                            <BtnAdd titleAccess="Add" onClick={() => handleAddUser(searchData)}/>
                        </UserContainer>
                    : null
                }  
                {   
                    statusView === 'viewListMember' && listMember?.length! > 0 ? listMember?.map((mem: any) =>
                        <UserContainer key={mem?.id}>
                            <UserAvatar src={mem?.photoURL} />
                            <TextEmail>{mem?.email}</TextEmail>
                            <BtnRemove titleAccess="Remove" onClick={() => handleRemoveUser(mem)} style={{display: mem.id === user?.uid ? 'none': 'block'}}/>
                        </UserContainer>
                    ) : null
                }    
                </ListMemberScreen>
                <BtnContainer>
                    <AcceptBtn 
                        style={{display: listMember?.length! < 3 || groupName.length < 3 ? 'none' : 'block'}} 
                        onClick={handleCreateNewGroupChat}>Create Group
                    </AcceptBtn>
                </BtnContainer>
            </SidebarContainer>
        </Container>
    )
}