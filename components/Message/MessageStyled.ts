import { Avatar } from "@mui/material";
import styled from "styled-components";

export const MessageContent = styled.div``

export const Container = styled.div`
    display: flex;
`;

export const ContainerSender = styled(Container)`
    margin-left: auto;
    margin-right: 15px;
`;
export const ContainerReciever = styled(Container)`
    
`;

export const UserAvatarSender = styled(Avatar)`
    width: 50px;
    height: 50px;
`;

export const UserAvatarReciever = styled(Avatar)`
    width: 50px;
    height: 50px;
`;

export const MessageElement = styled.div`
    width: fit-content;
    padding: 10px 15px 30px 15px;
    margin: 5px 0;
    border-radius: 8px;
    min-width: 60px;
    position: relative;
    text-align: left;
    max-width: 1000px;
    min-width: 80px;
    min-height: 75px;
`;

export const Sender = styled(MessageElement)`
    margin-right: 15px;
    background-color: #aeecf7;
`;

export const Reciever = styled(MessageElement)`
    margin-left: 15px;
    background-color: whitesmoke;
    text-align: left;
`;

export const Timestamp = styled.span`
    color: gray;
    padding: 5px;
    font-size: 12px;
    position: absolute;
    bottom: 5px;
    left: 10px;
`;