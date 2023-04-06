import { useEffect, useState } from "react";
import Friend from "../Friend/Friend";
import { Col, Container, Row } from "../FriendsListScreen/FriendsListScreenStyled";
import getAllFriendCurrentUser from "@/services/friends/getAllFriendCurrentUser";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import RequestAddFriend from "../FriendRequest/FriendRequest";

function FriendRequestsListScreen() {

    const [user] = useAuthState(auth);
    const [friendList, setFriendList]: any = useState([]);

    useEffect(() => {
        getAllFriendCurrentUser(user?.uid).then((friends) => setFriendList(friends))
    },[])

    return (
        <Container>
            <Row>
                { friendList.length > 0 ? friendList.map((friend: any) => 
                    <Col key={friend.id}>
                        <RequestAddFriend userId={friend.data().userId} email={friend.data().email} />
                    </Col>
                ) : null}
                <Col>
                    <RequestAddFriend />
                </Col>
                <Col>
                    <RequestAddFriend />
                </Col>
                <Col>
                    <RequestAddFriend />
                </Col>
                
                <Col>
                    <RequestAddFriend />
                </Col>
                <Col>
                    <RequestAddFriend />
                </Col>
                <Col>
                    <RequestAddFriend />
                </Col>
                <Col>
                    <RequestAddFriend />
                </Col>
                <Col>
                    <RequestAddFriend />
                </Col>
                <Col>
                    <RequestAddFriend />
                </Col>
                <Col>
                    <RequestAddFriend />
                </Col>
            </Row>
            
        </Container>
    )
}

export default FriendRequestsListScreen;