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
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;
    border-right: 1px solid whitesmoke;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    @media (max-width: 1600px) {
        display: none;
    }
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
    font-weight: 500;
    font-size: 17px;
    margin-top: 2px;
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