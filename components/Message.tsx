import { auth } from "@/firebase";
import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components"

export default function Message({user, message}: any) {
    const [userLoggedIn] = useAuthState(auth);

    const TypeOfMessage = user === userLoggedIn?.email ? Sender : Reciever;

    return (
        <Container>
            <TypeOfMessage>
                {message.message}
                <Timestamp>
                    {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
                </Timestamp>
            </TypeOfMessage>
        </Container>
    )
}

const Container = styled.div``;

const MessageElement = styled.p`
    width: fit-content;
    padding: 15px 15px 20px 15px;
    border-radius: 8px;
    margin: 10px;
    min-width: 60px;
    padding-bottom: 26px;
    position: relative;
    text-align: left;
`;

const Sender = styled(MessageElement)`
    margin-left: auto;
    background-color: #aeecf7;
`;

const Reciever = styled(MessageElement)`
    background-color: whitesmoke;
    text-align: left;
`;

const Timestamp = styled.span`
    color: gray;
    padding: 5px;
    font-size: 12px;
    position: absolute;
    bottom: 0;
    text-align: right;
    right: 0;
`;
