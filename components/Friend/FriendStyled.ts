import { Avatar, Button, CardContent, Typography } from "@mui/material";
import styled from "styled-components";


export const Container = styled.div`
    margin-bottom: 20px;
`;

export const ButtonCustom = styled.button`
    width: 100%;
    border: none;
    height: 40px;
    border-radius: 5px;
    :hover {
        opacity: 0.7;
    }
`

export const SendMessageBtn = styled(ButtonCustom)`
    background: #0DA3BA;
    color: white;
`

export const UnfriendBtn = styled(ButtonCustom)`
    margin-top: 10px;
    /* background: red;
    color: white; */
`

export const CardContentCustom = styled(CardContent)`
    text-align: center;
    padding: 10px;
    margin-top: 50px;
`

export const TextEmail = styled.p`
    
`;

export const UserAvatar = styled(Avatar)`
    width: 100px;
    height: 100px;
    position: absolute;
    margin-top: 10%;
    margin-left: 5.7%;
`;