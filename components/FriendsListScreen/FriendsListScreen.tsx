import { useEffect, useState } from "react";
import Friend from "../Friend/Friend";
import { Col, Container, Row } from "./FriendsListScreenStyled";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import getAllFriendCurrentUser from "@/services/friends/getAllFriendCurrentUser";

export default function FriendsListScreen() {

    const [user] = useAuthState(auth);
    const [friendList, setFriendList]: any = useState([]);

    useEffect(() => {
        getAllFriendCurrentUser(user?.email!)
        .then((friends) => setFriendList(friends))
    },[])

    return (
        <Container>
            <Row>
                { friendList.length > 0 ? friendList.map((friend: any) => 
                    <Col key={friend.id}>
                        <Friend email={friend.data().email} />
                    </Col>
                ) : null}
                <Col>
                    <Friend />
                </Col>
                <Col>
                    <Friend />
                </Col>
                <Col>
                    <Friend />
                </Col>
                
                <Col>
                    <Friend />
                </Col>
                <Col>
                    <Friend />
                </Col>
                <Col>
                    <Friend />
                </Col>
                <Col>
                    <Friend />
                </Col>
                <Col>
                    <Friend />
                </Col>
                <Col>
                    <Friend />
                </Col>
                <Col>
                    <Friend />
                </Col>
                <Col>
                    <Friend />
                </Col>
                <Col>
                    <Friend />
                </Col>
                <Col>
                    <Friend />
                </Col>
                <Col>
                    <Friend />
                </Col>
                <Col>
                    <Friend />
                </Col>
                <Col>
                    <Friend />
                </Col>
                <Col>
                    <Friend />
                </Col>
            </Row>
            
        </Container>
    )
}