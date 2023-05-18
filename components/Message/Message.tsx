import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import getUserByEmail from "@/services/users/getUserByEmail";
import { Container, ContainerReciever, ContainerSender, MessageContent, Reciever, Sender, Timestamp, UserAvatarReciever, UserAvatarSender } from "./MessageStyled";

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
                    <Sender style={{marginRight: showAvatar ? '65px' : ''}} title={'Sent at ' +  formatDate(message.timestamp)}>
                        <MessageContent dangerouslySetInnerHTML={{__html: message.message}}></MessageContent>
                    </Sender>
                    { !showAvatar ? <UserAvatarSender src={userLoggedIn?.photoURL ?? ''} /> : null }
                </ContainerSender> 
                : 
                <ContainerReciever>
                    { !showAvatar ? <UserAvatarReciever src={userInfo?.photoURL ?? ''} /> : null }
                    <Reciever style={{marginLeft: showAvatar ? '65px' : ''}} title={'Sent at ' +  formatDate(message.timestamp)}>
                        <MessageContent dangerouslySetInnerHTML={{__html: message.message}}></MessageContent>
                    </Reciever>
                </ContainerReciever>
            }
        </Container>
    )
}



