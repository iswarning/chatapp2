import { useEffect, useState } from "react";
import Friend from "../Friend/Friend";
import { Col, Container, Row } from "./FriendsListScreenStyled";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import getAllFriendOfUser from "@/services/friends/getAllFriendOfUser";

export default function FriendsListScreen() {

    const [user] = useAuthState(auth);
    const [friendList, setFriendList]: any = useState([]);

    useEffect(() => {
        getAllFriendOfUser(user?.email!)
        .then((friends) => setFriendList(friends))
    },[])

    return (
        <Container>
            <Row>
                { friendList.length > 0 ? friendList.map((friend: any) => 
                    <Col key={friend.id}>
                        <Friend users={friend.data().users} />
                    </Col>
                ) : null}
            </Row>
            
        </Container>
    )
}