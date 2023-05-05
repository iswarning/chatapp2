import { CardContent } from "@mui/material";
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
`

export const CardContentCustom = styled(CardContent)`
    text-align: center;
    padding: 10px;
    margin-top: 10px;
`

export const TextEmail = styled.p`
    
`;