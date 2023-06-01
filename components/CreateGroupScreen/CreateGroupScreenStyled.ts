import { Avatar } from "@mui/material";
import styled from "styled-components";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

export const Container = styled.div.attrs(() => ({
    className: 'container'
}))`
    /* border: 1px solid whitesmoke; */
`

export const SidebarContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    max-height: 600px;
    overflow-y: scroll;
    text-align: center;
    ::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;

export const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
    height: 60px;
    border-bottom: 1px solid whitesmoke;
`;

export const SearchInput = styled.input`
    outline-width: 0;
    border: none;
    flex: 1;
`;

export const BtnContainer = styled.div`
    margin-top: auto;
    padding: 10px;
    text-align: center;
`

export const CountMemberContainer = styled.div`
    margin-left: 20px;
    display: flex;
`;
export const Label = styled.label`
    margin-top: auto;
    margin-bottom: auto;
`;
export const CountMemberValue = styled.label`
    margin-top: auto;
    margin-bottom: auto;
`;
export const GroupNameContainer = styled.div`
    padding: 15px 20px 0 20px;
    
`;
export const GroupNameInput = styled.input`
    /* border: 1px solid whitesmoke; */
    width: 300px;
    outline-width: 0;
    border: none;
`;
export const BtnViewListMember = styled.button`
    border: none;
    height: 40px;
    border-radius: 5px;
    :hover {
        opacity: 0.7;
    }
    width: 85px;
    margin-left: 75px;
`;
export const BtnBack = styled.button`
    border: none;
    height: 40px;
    border-radius: 5px;
    :hover {
        opacity: 0.7;
    }
    width: 85px;
    margin-left: 75px;
`;

export const SidebarFixed = styled.div`
    /* position: sticky;
    z-index: 1; */
`
export const ListMemberScreen = styled.div`
    
`

export const UserContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    word-break: break-word;
    height: 60px;
`;

export const TextEmail = styled.p`
    margin-top: 15px;
`;

export const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;
export const BtnAdd = styled(AddCircleIcon)`
    margin-left: auto;
    cursor: pointer;
    color: #0DA3BA;
`;
export const BtnRemove = styled(RemoveCircleIcon)`
    margin-left: auto;
    cursor: pointer;
    color: #0DA3BA;
`;


