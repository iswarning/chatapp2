import styled from "styled-components";
import Head from 'next/head'
import { Button } from "@mui/material";
import { auth, provider } from "../firebase";
import firebase from "firebase";

const signIn = async() => {
    await firebase.auth().signInWithPopup(provider);
}

function Login() {
    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <LoginContainer>
                <center className="d-flex flex-column">
                    <div>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/768px-WhatsApp.svg.png" alt="" style={{ marginBottom: '50px' }} height={200} width={200} />
                    </div>
                    <Button variant="outlined" color="success" onClick={signIn}>Sign In with Google Account</Button>
                </center>
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