import { Avatar } from "@mui/material";
import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 70px;
    align-items: center;
    padding: 20px;
    background-color: #0DA3BA;
    height: 100%;
`;

export const AvatarButton = styled.button`
    border: none;
    background: #0DA3BA;
    margin-bottom: 2px;
    padding: 4px 0;
`;

export const ButtonCustom = styled.button`
    width: 70px;
    padding-top: 15px;
    padding-bottom: 20px;
    border: none;
    cursor: pointer;
    height: 60px;
    color: white;
    background: #0DA3BA;
    :hover {
        opacity: 0.7;
    }
`;

export const ButtonCustomActive = styled.button`
    width: 70px;
    padding-top: 15px;
    padding-bottom: 20px;
    border: none;
    cursor: pointer;
    height: 60px;
    color: rgb(4, 110, 148);
    background: rgb(182, 236, 255);
`;

export const UserAvatar = styled(Avatar)`
    cursor: pointer;
    width: 50px;
    height: 50px;
    :hover {
        opacity: 0.5;
    }
`;

export const LogoutBtn = styled(ButtonCustom)`
    margin-top: auto;
`;