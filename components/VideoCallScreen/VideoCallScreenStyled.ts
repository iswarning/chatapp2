import { Avatar, IconButton } from "@mui/material";
import styled, { keyframes } from "styled-components";

export const VideoCalling = styled.div``;

export const VideoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, 300px);
    grid-auto-rows: 300px;
    margin-left: 50px;
    margin-top: 0;
`;

export const Video = styled.video`
    margin: 20px;
    width: 1650px;
    height: 700px;
    object-fit: cover;
    border-radius: 5px;
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

export const StatusCalling = styled.h3`
    margin-top: 100px;
    text-align: center;
    color: white;
`;

export const ActionBtn = styled.div`
    background-color: silver;
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

export const RecipientName = styled.h2`
    margin-top: 20px;
    text-align: center;
    color: white;
`;

const pulse = keyframes`
    0% {
        transform: scale(0.5);
        opacity: 0
    }

    50% {
        transform: scale(1);
        opacity: 1
    }

    100% {
        transform: scale(1.3);
        opacity: 0
    }
`

export const Pulse = styled.div`
    height: 200px;
    width: 200px;
    background-color: orange;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &:before {
        content: "";
        position: absolute;
        border: 1px solid yellow;
        width: calc(100% + 40px);
        height: calc(100% + 40px);
        border-radius: 50%;
        animation: ${pulse} 1s linear infinite
    }

    &:after {
        content: "";
        position: absolute;
        border: 1px solid yellow;
        width: calc(100% + 40px);
        height: calc(100% + 40px);
        border-radius: 50%;
        animation: ${pulse} 1s linear infinite;
        animation-delay: 0.3s
    }

`;

export const ContentCenter = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
`