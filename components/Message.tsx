import { auth } from "@/firebase";
import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components"
import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import getUserByEmail from "@/services/users/getUserByEmail";

export default function Message({user, message}: any) {

    const [userLoggedIn] = useAuthState(auth);

    const [userInfo, setUserInfo]: any = useState({})

    useEffect(() => {
        getUserByEmail(user).then((u) => {
            if(u) {
                setUserInfo(u.data());
            }
        })
    },[])

    return (
        <Container>
            {
                user === userLoggedIn?.email ? <ContainerSender>
                    <Sender>
                        {message.message}
                        <Timestamp>
                            {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
                        </Timestamp>
                    </Sender>
                    <UserAvatarSender src={userLoggedIn?.photoURL ?? ''} />
                </ContainerSender> 
                : 
                <ContainerReciever>
                    <UserAvatarReciever src={userInfo?.photoURL ?? ''} />
                    <Reciever>
                        {message.message}
                        <Timestamp>
                            {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
                        </Timestamp>
                    </Reciever>
                </ContainerReciever>
            }
            
        </Container>
    )
}

const Container = styled.div`
    display: flex;
`;

const ContainerSender = styled(Container)`
    margin-left: auto;
`;
const ContainerReciever = styled(Container)`
    
`;

const UserAvatarSender = styled(Avatar)`
    width: 50px;
    height: 50px;
`;

const UserAvatarReciever = styled(Avatar)`
    width: 50px;
    height: 50px;
`;

const MessageElement = styled.p`
    width: fit-content;
    padding: 10px 15px 30px 15px;
    border-radius: 8px;
    min-width: 60px;
    position: relative;
    text-align: left;
    max-width: 1000px;
`;

const Sender = styled(MessageElement)`
    margin-right: 15px;
    background-color: #aeecf7;
`;

const Reciever = styled(MessageElement)`
    margin-left: 15px;
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
    right: 10px;
`;
