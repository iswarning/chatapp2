import { Avatar } from "@mui/material";
import styled from "styled-components";

export const MessageContent = styled.div``

export const Container = styled.div`
    display: flex;
    margin-bottom: 5px;
`;

export const ContainerSender = styled(Container)`
    margin-left: auto;
    margin-right: 15px;
`;
export const ContainerReciever = styled(Container)`
    
`;

// export const UserAvatarSender = styled(Avatar)`
//     width: 50px;
//     height: 50px;
// `;

export const UserAvatarReciever = styled(Avatar)`
    width: 50px;
    height: 50px;
`;

export const MessageElement = styled.div`
    width: fit-content;
    padding: 10px 20px;
    border-radius: 10px;
    position: relative;
    text-align: left;
    max-width: 1000px;
    min-width: 80px;
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