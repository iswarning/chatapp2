import { useEffect, useState } from "react";
import { Col, Container, Row } from "../FriendsListScreen/FriendsListScreenStyled";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import FriendRequest from "../FriendRequest/FriendRequest";
import getFriendRequestsByEmail from "@/services/friend-requests/getFriendRequestsByEmail";

function FriendRequestsListScreen() {

    const [user] = useAuthState(auth);
    const [data, setData]: any = useState([]);

    useEffect(() => {
        getFriendRequestsByEmail(user?.email!).then((res) => setData(res))
    },[])

    return (
        <Container>
            <Row>
                { data.length > 0 ? data.map((friendRequest: any) => 
                    <Col key={friendRequest.id}>
                        <FriendRequest email={friendRequest.data().email} />
                    </Col>
                ) : null}
            </Row>
            
        </Container>
    )
}

export default FriendRequestsListScreen;