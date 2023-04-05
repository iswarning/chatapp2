import { useEffect, useState } from "react";
import Friend from "../Friend/Friend";
import { Col, Container, Row } from "./FriendsListScreenStyled";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import getAllFriendCurrentUser from "@/services/friends/getAllFriendCurrentUser";

export default function FriendsListScreen() {

    const [user] = useAuthState(auth);
    const [friendList, setFriendList]: any = useState([]);

    const [friendSnapshot] =  useCollection(
        db
        .collection('users')
        .doc(user?.uid)
        .collection('friends')
    );

    useEffect(() => {
        getAllFriendCurrentUser(user?.uid).then((friends) => setFriendList(friends))
    },[])

    return (
        <Container>
            <Row>
                { friendList.length > 0 ? friendList.map((friend: any) => 
                    <Col key={friend.id}>
                        <Friend userId={friend.data().userId} email={friend.data().email} />
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