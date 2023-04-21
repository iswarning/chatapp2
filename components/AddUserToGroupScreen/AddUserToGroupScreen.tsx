import { useState } from "react";
import { BtnAdd, BtnBack, BtnContainer, BtnRemove, BtnViewListMember, Container, CountMemberContainer, CountMemberValue, FriendContainer, GroupNameContainer, GroupNameInput, Label, ListMemberScreen, Search, SearchInput, SidebarContainer, SidebarFixed, TextEmail, UserAvatar } from "./AddUserToGroupScreenStyled";
import SearchIcon from '@mui/icons-material/Search';
import { Button } from "@mui/material";
import { AcceptBtn } from "../FriendRequest/FriendRequestStyled";

export default function AddUserToGroupScreen() {

    const [searchInput, setSearchInput] = useState('');
    const [totalMember, setTotalMember] = useState(0);
    const [groupName, setGroupName] = useState('');
    const [listMember, setListMember]: any = useState([]);
    const [statusView, setStatusView] = useState('viewFriend');

    const handleSearch = (e: any) => {
        setSearchInput(e.target.value);
    }

    const handleAddUser = () => {
        setListMember((oldListMember: any) => [{ id: listMember.length, email: 'wijeiwjeiwjei@gmail.com', photoURL: '/images/avatar-default.jpg'}, ...oldListMember])
        setTotalMember(totalMember + 1);
    }

    return (
        <Container>
            <SidebarContainer>
                <Search>
                    <SearchIcon />
                    <SearchInput placeholder='Nhập số điện thoại để tìm bạn bè' value={searchInput} onChange={handleSearch}/>
                </Search>
                <GroupNameContainer>
                    <GroupNameInput placeholder="Nhap ten nhom" value={groupName} disabled={listMember.length === 0} onChange={(e) => setGroupName(e.target.value)}/>
                </GroupNameContainer>
                <CountMemberContainer>
                    <Label>Tổng thành viên:</Label>
                    <CountMemberValue>&nbsp; {totalMember}</CountMemberValue>
                    { statusView === 'viewFriend' ? <BtnViewListMember onClick={() => setStatusView('viewListMember')}>Xem</BtnViewListMember> : null}
                    { statusView === 'viewListMember' ? <BtnBack onClick={() => setStatusView('viewFriend')}>Quay lai</BtnBack> : null}
                </CountMemberContainer>
                <ListMemberScreen style={{overflowY: listMember.length > 7 && statusView === 'viewListMember' ? 'scroll' : 'unset'}}>
                {
                    statusView === 'viewFriend' ? 
                        <FriendContainer>
                            <UserAvatar src='/images/avatar-default.jpg' />
                            <TextEmail>ciowjeowk@mgial.com</TextEmail>
                            <BtnAdd titleAccess="Thêm vào nhóm" onClick={handleAddUser}/>
                        </FriendContainer>
                    : null
                }
                {   statusView === 'viewListMember' && listMember.length > 0 ? listMember.map((mem: any) =>
                        <FriendContainer key={mem.id}>
                            <UserAvatar src={mem.photoURL} />
                            <TextEmail>{mem.email}</TextEmail>
                            <BtnRemove titleAccess="Moi ra khoi nhóm" onClick={handleAddUser}/>
                        </FriendContainer>
                    )  : null
                }    
                </ListMemberScreen>
                <BtnContainer>
                    <AcceptBtn disabled={listMember.length === 0}>Create Group</AcceptBtn>
                </BtnContainer>
            </SidebarContainer>
        </Container>
    )
}