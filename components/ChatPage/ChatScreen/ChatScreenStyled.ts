import { Avatar } from "@mui/material";
import ReactModal from "react-modal";
import styled from "styled-components";

export const StatusSendContainer = styled.div`
    text-align: right;
    padding-right: 80px;
`;

export const TextStatusSend = styled.span`
    font-size: 14px;
    color: gray;
`;


export const VideoCallContainer = styled(ReactModal)`
    width: 400px;
    height: 700px;
    background-color: #0DA3BA;
    margin-left: auto;
    margin-right: auto;
    margin-top: 100px;
`;

export const BtnSend = styled.button``;

export const EmojiContainer = styled.div.attrs(() => ({
    className: ''
}))`
    position: absolute;
    width: max-content;
    max-width: 400px;
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 500px;
    overflow: scroll;
    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
    display: flex;
    flex-wrap: wrap;
    max-height: 400px;
`

export const EmojiElement = styled.div.attrs(() => ({
    className: ''
}))`
    width: 25%;
    cursor: pointer;
    font-size: 50px;
    padding-left: 10px;
    :hover {
        border-radius: 10px;
        background-color: #ddebeb;
    }
`

export const Emoji = styled.div`
    font-size: 40px;
`

export const UserAvatar = styled(Avatar)`
    width: 50px;
    height: 50px;
`

export const Container = styled.div`
    font-size: 18px;
`;

export const TextEmail = styled.label`
    margin-top: 10px;
    font-weight: 500;
`; 

export const Input = styled.input`
    flex: 1;
    outline: 0;
    border: none;
    border-radius: 10px;
    background-color: whitesmoke;
    padding: 20px;
    margin-left: 15px;
`;

export const InputContainer = styled.form`
    display: flex;
    align-items: center;
    padding: 10px;
    position: fixed;
    bottom: 0;
    background-color: white;
    z-index: 100;
    width: 100%;
`;

export const Header = styled.div`
    position: sticky;
    background-color: white;
    z-index: 100;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 1px solid whitesmoke;
`;
export const HeaderInformation = styled.div`
    margin-left: 15px;
    flex: 1;

    > h3 {
        margin-bottom: 3px;
    }

    > p {
        font-size: 14px;
        color: gray;
    }
`;
export const EndOfMessage = styled.div`
    margin-bottom: 50px;
`;
export const HeaderIcons = styled.div``;
export const MessageContainer = styled.div`
    padding: 20px 10px 40px 30px;
    background-color: #ddebeb;
    min-height: 90vh;
    
`;