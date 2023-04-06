import styled from "styled-components";
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const Container = styled.div`
    
`;

const MenuContainer = styled.div`
    height: 100vh;
    
`;

const SidebarContainer = styled.div`
    padding-top: 20px;
    flex: 0.45s;
    box-shadow: whitesmoke;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    @media (max-width: 1600px) {
        display: none;
    }
    box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
`;

const ItemContainer = styled.div`
    cursor: pointer;
    padding: 15px 0px 0px 20px;
    height: 60px;
    word-break: break-word;
    :hover {
        background-color: #e9eaeb;
    }
    display: flex;
`;

const ItemContainerActive = styled.div`
    cursor: pointer;
    padding: 15px 0px 0px 20px;
    height: 60px;
    word-break: break-word;
    background: #e9eaeb;
    display: flex;
`;

const TextItem = styled.div`
    font-weight: 700;
    margin-top: 5px;
`;

const FixedMenu = styled.div`
    display: flex;
    position: fixed;
    z-index: 1;
    width: 22%;
`;

const MainContent = styled.div`
    width: 78%;
    float: right;
    padding: 20px;
    background: whitesmoke;
`

const IconsContainer = styled.div`
    padding: 3px 4px 4px 5px;
    width: 35px;
    height: 35px;
`;

const IconsContainerActive = styled.div`
    border-radius: 50%;
    padding: 3px 4px 4px 5px;
    width: 35px;
    height: 35px;
    background-color: #0DA3BA;
    color: white;
`;

export { TextItem, 
    ItemContainer,
    SidebarContainer,
    MenuContainer,
    Container, 
    FixedMenu,
    MainContent,
    IconsContainer,
    IconsContainerActive,
    ItemContainerActive}