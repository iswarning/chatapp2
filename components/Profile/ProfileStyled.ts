import Avatar from "@mui/material/Avatar/Avatar";
import styled from "styled-components";

export const Container = styled.div``;

export const BtnContainer = styled.div`
    text-align: center;
    margin-top: 10px;
`;

export const TextGroupRow = styled.div.attrs(() => ({
    className: 'form-group row'
}))`

`;

export const TextGroupCol = styled.div.attrs(() => ({
    className: 'offset-sm-5 col-sm-6 offset-sm-1'
}))``;

export const TextGroup = styled.div.attrs(() => ({
    className: 'form-group row'
}))``;

export const ValueContainer = styled.div.attrs(() => ({
    className: 'col-sm-4 col-12'
}))``;

export const Value = styled.p.attrs(() => ({
    className: 'form-control-plaintext'
}))``;

export const Label = styled.label.attrs(() => ({
    className: 'col-sm-3 col-12 col-form-label'
}))`
    
`;

export const Upper = styled.div`
    position: absolute;
`;

export const UpperImage = styled.img`
    height: 400px;
    width: 1290px;
    border-radius: 10px;
`;

export const UserContainer = styled.div`
    padding-top: 280px;
`;

export const UserProfile = styled.div`
    
`;

export const UserAvatar = styled(Avatar)`
    display: block;
    margin-left: auto;
    margin-right: auto;
    width: 200px;
    height: 200px;
    border: 10px solid #fff;
`;

export const TextName = styled.h1`
    margin: 10px 0 15px 540px;
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

export const InformationContainer = styled.div`
    padding-bottom: 50px;
`;
