import styled from "styled-components";
import Head from 'next/head'
import { Button } from "@mui/material";
import { auth, provider } from "../firebase";

const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
}

function Login() {
    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <LoginContainer>
                <Button variant="outlined" color="success" onClick={signIn}>Sign In with Google Account</Button>
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
    
`;