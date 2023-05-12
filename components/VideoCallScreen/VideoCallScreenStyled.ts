import { Avatar, IconButton } from "@mui/material";
import styled from "styled-components";

export const VideoCalling = styled.div``;

export const VideoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, 300px);
    grid-auto-rows: 300px;
    margin-left: 50px;
    margin-top: 0;
`;

export const Video = styled.video`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;

export const UserAvatar = styled(Avatar)`
    width: 200px;
    height: 200px;
    margin-left: auto;
    margin-right: auto;
`;

export const UserContainer = styled.div`
    padding-top: 50px;
`;
export const BtnContainer = styled.div`
    margin-top: 50px;
    display: flex;
`;
export const BtnRejectCall = styled.button`
    border-radius: 50%;
    width: 80px;
    height: 80px;
    margin: auto;
    border: none;
    background: #FD3301;
    color: white;
`;
export const BtnAcceptCall = styled.button`
    border-radius: 50%;
    width: 80px;
    height: 80px;
    margin: auto;
    border: none;
    background: #13BF02;
    color: white;
`;

export const StatusCalling = styled.h2`
    margin-top: 50px;
    text-align: center;
    color: white;
`;

export const ActionBtn = styled.div`
    color: white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin: 0 10px;
    padding-left: 7px;
    padding-top: 7px;
    margin: auto;
    cursor: pointer;
`;

export const ActionBtnActive = styled.div`
    color: rgb(4,110,148);
    margin: 0 10px;
    background-color: rgb(182,236,255);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    padding-left: 7px;
    padding-top: 7px;
    margin: auto;
    cursor: pointer;
`;

export const ActionGroup = styled.div`
    display: flex;
    margin: 0px 20px;
`;