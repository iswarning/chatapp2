import styled from "styled-components";
import Head from 'next/head'
import { Button } from "@mui/material";
import { auth, db, provider } from "@/firebase";
import { User, signInWithPopup } from "firebase/auth";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore/lite";

const signIn = () => {
    signInWithPopup(auth, provider).then((user) => {
        createNewUser(user.user)
    }).catch(alert);
}

const createNewUser = async (user: User) => {
    const userCollection = collection(db, 'users');
    const userDoc = doc(userCollection, 'users');
    await setDoc(userDoc, {
      email: user?.email,
      lastSeen: serverTimestamp(),
      photoURL: user?.photoURL,
    }, { merge: true });
}

function Login() {
    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <LoginContainer>
                <Logo src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/768px-WhatsApp.svg.png" />
                <Button onClick={signIn} variant="outlined">Sign in with Google</Button>
            </LoginContainer>
        </Container>
    )
}

export default Login;

const Container = styled.div`
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: whitesmoke;
`;

const LoginContainer = styled.div`
    padding: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7);
`;

const Logo = styled.img`
    height: 200px;
    width: 200px;
    margin-bottom: 50px;
`;