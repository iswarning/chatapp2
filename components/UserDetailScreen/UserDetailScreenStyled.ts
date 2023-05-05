// import Avatar from "@mui/material/Avatar/Avatar";
import styled from "styled-components";
import { SendMessageBtn } from "../Friend/FriendStyled";
import { CancelBtn } from "../FriendRequest/FriendRequestStyled";
import { Avatar } from "@mui/material";

export const Container = styled.div.attrs(() => ({
    // className: 'container'
}))`
    padding: 20px;
`;

export const BtnContainer = styled.div`
    margin-top: 10px;
`;

export const TextGroupRow = styled.div.attrs(() => ({
    className: 'form-group row'
}))`

`;

export const TextGroupCol = styled.div.attrs(() => ({
    className: 'col-sm-6'
}))``;

export const TextGroup = styled.div.attrs(() => ({
    className: 'form-group row'
}))``;

export const ValueContainer = styled.div.attrs(() => ({
    className: 'col-sm-10 col-12'
}))``;

export const Value = styled.p.attrs(() => ({
    className: 'form-control-plaintext'
}))``;

export const Label = styled.label.attrs(() => ({
    className: 'col-sm-2 col-12 col-form-label'
}))`
    
`;

export const UpperImage = styled.img.attrs(() => ({
    // className: 'col-md-12'
}))`
    top: 0;
    position: relative;
    height: 400px;
    border-radius: 10px;
    width: 100%;
`;

export const UserContainer = styled.div.attrs(() => ({
    // className: 'row'
}))`
    position: relative;
`;

export const UserProfile = styled.div`
    top: 90%;
    margin-left: 2%;
    position: absolute;
    display: flex;
`;

export const UserAvatar = styled(Avatar)`
    width: 150px;
    height: 150px;
    border: 5px solid #fff;
`;

export const TextName = styled.h3`
`;

export const UpdateButton = styled.button`
    color: white;
    background-color: #0DA3BA;
    padding: 5px 7px 5px 7px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    width: max-content;
    height: 40px;
    
    :hover {
        opacity: 0.7;
    }
`;

export const InformationContainer = styled.div.attrs(() => ({
    className: 'shadow-sm p-3 mb-5 bg-white rounded'
}))`
    margin-top: 10%;
    /* padding: 10px auto; */
`;

export const TextFriend = styled.span`
    font-size: 12px;
    font-style: italic;
`;

export const UserInfo = styled.div`
    margin-top: auto;
    margin-bottom: auto;
    flex-direction: column;
`;

export const UserBtnGroup = styled.div`
    flex-direction: row;
    margin-top: auto;
    margin-bottom: auto;
    float: right;
`;

export const StatusFriendBtn = styled(SendMessageBtn)`
    width: 150px;
    margin: 10px 0 10px 10px;
    padding-top: auto;
    padding-bottom: auto;
    /* padding: 20px; */
`;

export const SendMessageBtnUser = styled(CancelBtn)`
    margin: 10px 0 10px 10px;
    width: 150px;
`;


