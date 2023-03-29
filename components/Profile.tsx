import { auth } from "@/firebase";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth"
import styled from "styled-components";
import { Avatar } from "@mui/material";

export default function Profile() {

    const [user] = useAuthState(auth);
    const router = useRouter();

    useEffect(() => {
        if(!user) {
            router.push('/');
        }
    },[])

    return (
        <Container>
            <Upper>
                <UpperImage src="https://images2.thanhnien.vn/Uploaded/sangdt/2022_03_16/jujutsu-kaisen-0-486.jpg" />
            </Upper>
            <UserContainer>
                <UserProfile>
                    <UserAvatar src={user?.photoURL!} />
                </UserProfile>
            </UserContainer>
            <TextName>{user?.displayName}</TextName>
            <InformationContainer>
                <TextTitle>Information</TextTitle>
                <TextBirthplace>Birth Place: Los Angeles</TextBirthplace>
                <TextGender>Gender: Male</TextGender>
                <TextPhone>Phone: 0903123456</TextPhone>
                <UpdateButton>Update Information</UpdateButton>
            </InformationContainer>
        </Container>
    )
}

const Container = styled.div``;

const Upper = styled.div`
    padding-right: 350px;
    padding-bottom: 100px;
`;

const UpperImage = styled.img`
    width: 350px;
    height: 170px;
    position: absolute;
`;

const UserContainer = styled.div`
    /* margin-bottom: 200px; */
`;

const UserProfile = styled.div`
    
`;

const UserAvatar = styled(Avatar)`
    width: 100px;
    height: 100px;
    margin: 20px auto;
    border: 3px solid #fff;
`;

const TextName = styled.div`
    font-size: 25px;
    font-weight: 700;
    margin: 20px auto;
`;

const TextTitle = styled.div`
    font-weight: 700;
    margin: 20px auto;
`;

const TextGender = styled.div`
    margin: 10px auto;
`;

const TextBirthplace = styled.div`
    margin: 10px auto;
`;

const TextPhone = styled.div`
    margin: 10px auto;
`;

const UpdateButton = styled.button`
    color: white;
    background-color: #008060;
    padding: 10px;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    width: max-content;
    height: 40px;
    
    :hover {
        background: #00d7c3;
    }
`;

const InformationContainer = styled.div`
    /* padding: 20px; */
`;



