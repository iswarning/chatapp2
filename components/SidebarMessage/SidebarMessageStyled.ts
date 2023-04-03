import styled from "styled-components";

const ButtonCustom = styled.a`
    cursor: pointer;
    color: rgba(0, 0, 0, 0.54);
    :hover {
        color: #00d7c3;
    }
    padding: 5px;
`;

const MenuContainer = styled.div``;

const Container = styled.div`
    display: flex;
`;

const SidebarContainer = styled.div`
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

const Search = styled.div`
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
    height: 60px;
    border-bottom: 1px solid whitesmoke;
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

const IconsContainer = styled.div``;

export { IconsContainer, 
    Header, 
    SearchInput, 
    SidebarButton, 
    SidebarContainer, 
    Search, 
    Container, 
    MenuContainer, 
    ButtonCustom }