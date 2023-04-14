import { Container, Header, MenuContainer, Search, SearchInput, SidebarContainer } from "@/components/SidebarMessage/SidebarMessageStyled";
import getAllUser from "@/services/users/getAllUser";
import { useState } from "react";
import Menu from "../Menu";
import SearchIcon from '@mui/icons-material/Search';
import User from "../User";
import UserDetailScreen from "../UserDetailScreen/UserDetailScreen";

export default function SidebarUser() {
    const [searchInput, setSearchInput] = useState('');
    const [searchData, setSearchData]: any = useState([]);

    const handleSearch = (value :any) => {
        setSearchInput(value);
        if(value.length >= 3) {
            getAllUser().then((users) => {
                setSearchData(users.filter((user) => 
                    user.data().email.indexOf(value) !== -1 ))
            })
        }
    }

    const handle = () => {
        console.log(121212121)
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
                    <SearchInput placeholder='Nhập ít nhất 3 ký tự để tìm kiếm' value={searchInput} onChange={(e) => handleSearch(e.target.value)}/>
                </Search>
                { 
                    searchData?.length > 0 && searchInput.length >= 3 ? searchData.map( (user:any) => 
                        <User key={user?.id} id={user?.id} photoURL={user?.data().photoURL} email={user?.data().email} onClick={() => handle()} />
                    ) : null 
                }
            </SidebarContainer>
            <UserDetailScreen />
        </Container>
    )
}