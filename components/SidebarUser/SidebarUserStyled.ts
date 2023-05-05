import { Avatar } from "@mui/material";
import styled from "styled-components";

export const UserContainer = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 15px;
    word-break: break-word;
    height: 60px;
    :hover {
        background-color: #e9eaeb;
    }
`;

export const TextEmail = styled.p`
    margin-top: 15px;
`;

export const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;

export const MenuContainer = styled.div``;

export const Container = styled.div.attrs(() => ({
    
}))`
    display: flex;
`
export const SidebarContainer = styled.div`
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
export const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`;

export const Header = styled.div`
    display: flex;
    top: 0;
    background-color: white;
    z-index: 1;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    height: 80px;
    border-bottom: 1px solid whitesmoke;
`;
export const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
    height: 60px;
    border-bottom: 1px solid whitesmoke;
`;
export const UserDetailContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;