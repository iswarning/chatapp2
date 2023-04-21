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