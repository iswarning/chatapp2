import { auth } from "@/firebase";
import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components"
import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import getUserByEmail from "@/services/users/getUserByEmail";

export default function Message({user, message, showAvatar}: any) {

    const [userLoggedIn] = useAuthState(auth);

    const [userInfo, setUserInfo]: any = useState({})

    useEffect(() => {
        getUserByEmail(user).then((u) => {
            if(u) {
                setUserInfo(u.data());
            }
        })
    },[])

    const formatDate = (dt: any) => {
        let d = new Date(dt);
        return d.getHours() + ":" + d.getMinutes();
    }

    return (
        <Container>
            {
                user === userLoggedIn?.email ? <ContainerSender>
                    <Sender style={{marginRight: showAvatar ? '65px' : ''}}>
                        <MessageContent dangerouslySetInnerHTML={{__html: message.message}}></MessageContent>
                        
                        <Timestamp>
                            {message.timestamp ? formatDate(message.timestamp) : '...'}
                        </Timestamp>
                    </Sender>
                    { !showAvatar ? <UserAvatarSender src={userLoggedIn?.photoURL ?? ''} /> : null }
                    
                </ContainerSender> 
                : 
                <ContainerReciever>
                    { !showAvatar ? <UserAvatarReciever src={userInfo?.photoURL ?? ''} /> : null }
                    <Reciever style={{marginLeft: showAvatar ? '65px' : ''}}>
                        <MessageContent dangerouslySetInnerHTML={{__html: message.message}}></MessageContent>
                        <Timestamp>
                            {message.timestamp ? formatDate(message.timestamp) : '...'}
                        </Timestamp>
                    </Reciever>
                </ContainerReciever>
            }
        </Container>
    )
}


const MessageContent = styled.div``

const Container = styled.div`
    display: flex;
`;

const ContainerSender = styled(Container)`
    margin-left: auto;
    margin-right: 15px;
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

const MessageElement = styled.div`
    width: fit-content;
    padding: 10px 15px 30px 15px;
    margin: 5px 0;
    border-radius: 8px;
    min-width: 60px;
    position: relative;
    text-align: left;
    max-width: 1000px;
    min-width: 80px;
    min-height: 75px;
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
    bottom: 5px;
    left: 10px;
`;
