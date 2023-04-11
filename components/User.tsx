import { auth, db } from "@/firebase";
import { Avatar } from "@mui/material";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";

export default function User({ id, photoURL, email }: any) {

    const router = useRouter();
    const [userLogged] = useAuthState(auth);

    const showUserProfile = () => {
        if(userLogged?.uid !== id) {
            router.push(`/user/${id}`)
        }
    }

    return (
        <Container onClick={showUserProfile}>
            <UserAvatar src={photoURL} />
            <TextEmail>{email}</TextEmail>
        </Container>
    )
}

const Container = styled.div`
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

const TextEmail = styled.p`
    margin-top: 15px;
`;

const UserAvatar = styled(Avatar)`
    margin: 5px;
    margin-right: 15px;
`;