import { Container, Header, MenuContainer, Search, SearchInput, SidebarContainer } from "@/components/SidebarMessage/SidebarMessageStyled";
import { useState } from "react";
import Menu from "../Menu";
import SearchIcon from '@mui/icons-material/Search';
import UserDetailScreen from "../UserDetailScreen/UserDetailScreen";
import { TextEmail, UserAvatar, UserContainer } from "./SidebarUserStyled";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import getStatusFriend from "@/utils/getStatusFriend";
import getUserByPhoneNumber from "@/services/users/getUserByPhoneNumber";

export default function SidebarUser() {
    const [user] = useAuthState(auth);
    const [searchInput, setSearchInput] = useState('');
    const [searchData, setSearchData]: any = useState({});
    const [userInfo, setUserInfo]: any = useState({});
    const [statusFriend, setStatusFriend]: any = useState('');

    const handleSearch = (value :any) => {
        setSearchData({});
        setSearchInput(value);
        if(value.length === 10) {
            getUserByPhoneNumber(value).then((u) => {
                if(u !== null) {
                    setSearchData(u);
                }
            });
        }
    }

    const showUserDetail = async (userDetail: any) => {
        const status = await getStatusFriend(user?.email!, userDetail.data().email);
        setStatusFriend(status);
        if(user?.uid !== userDetail.id && userDetail.exists) {
            setUserInfo(userDetail?.data());
        }
    }

    return (
        <Container>
            <MenuContainer>
                <Menu active='User' />
            </MenuContainer>
            <SidebarContainer>
                <Header>
                    
                </Header>
                <Search>
                    <SearchIcon />
                    <SearchInput placeholder='Nhập số điện thoại để tìm kiếm' value={searchInput} onChange={(e) => handleSearch(e.target.value)}/>
                </Search>
                { 
                    Object.keys(searchData).length > 0 && searchInput.length >= 3 ? 
                        <UserContainer key={searchData?.id} onClick={() => showUserDetail(searchData)} style={{background: (userInfo.email === searchData?.data()?.email) ? '#e9eaeb' : ''}}>
                            <UserAvatar src={searchData?.data()?.photoURL ?? ''} />
                            <TextEmail>{searchData?.data()?.email}</TextEmail>
                        </UserContainer>
                    : null 
                }
            </SidebarContainer>
            {
                Object.keys(userInfo).length > 0 ? <UserDetailScreen userInfo={userInfo} statusFriend={statusFriend} /> : null
            }
        </Container>
    )
}