import { Avatar, Button, CardContent, Typography } from "@mui/material";
import styled from "styled-components";


const Container = styled.div`
    margin-bottom: 20px;
`;

const ButtonCustom = styled.button`
    width: 100%;
    border: none;
    height: 40px;
    border-radius: 5px;
    :hover {
        opacity: 0.7;
    }
`

const SendMessageBtn = styled(ButtonCustom)`
    background: #0DA3BA;
    color: white;
`

const UnfriendBtn = styled(ButtonCustom)`
    margin-top: 10px;
    /* background: red;
    color: white; */
`

const CardContentCustom = styled(CardContent)`
    text-align: center;
    padding: 10px;
`

const TextEmail = styled.p`
    
`;

const UserAvatar = styled(Avatar)`
    
`;

export { Container, 
    TextEmail, 
    UserAvatar, 
    ButtonCustom, 
    CardContentCustom, 
    SendMessageBtn, 
    UnfriendBtn }