import styled from "styled-components";

const Container = styled.div`
    
`;

const MenuContainer = styled.div`
    height: 100vh;
    
`;

const SidebarContainer = styled.div`
    padding-top: 20px;
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
    @media (max-width: 1600px) {
        display: none;
    }
`;

const ItemContainer = styled.div`
    cursor: pointer;
    padding: 15px 10px 10px 20px;
    height: 60px;
    word-break: break-word;
    :hover {
        background-color: #e9eaeb;
    }
`;

const TextItem = styled.p`
    font-weight: 700;
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

export { TextItem, 
    ItemContainer,
    SidebarContainer,
    MenuContainer,
    Container, 
    FixedMenu,
    MainContent}