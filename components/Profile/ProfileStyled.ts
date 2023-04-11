import Avatar from "@mui/material/Avatar/Avatar";
import styled from "styled-components";

export const Container = styled.div`
    
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

export const Upper = styled.div`
    position: absolute;
`;

export const UpperImage = styled.img`
    height: 400px;
    width: 1280px;
    border-radius: 10px;
`;

export const UserContainer = styled.div`
    padding-left: 20px;
    padding-top: 350px;
`;

export const UserProfile = styled.div`
    
`;

export const UserAvatar = styled(Avatar)`
    width: 150px;
    height: 150px;
    border: 5px solid #fff;
`;

export const TextName = styled.h1`
    /* margin: 10px 0 15px 540px; */
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
    margin-top: 20px;
    padding: 10px auto;
`;
