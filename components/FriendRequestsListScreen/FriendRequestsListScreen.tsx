import { useEffect, useState } from "react";
import { Col, Container, Row } from "../FriendsListScreen/FriendsListScreenStyled";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import FriendRequest from "../FriendRequest/FriendRequest";
import getFriendRequestsRecipientByEmail from "@/services/friend-requests/getFriendRequestsRecipientByEmail";

function FriendRequestsListScreen() {

    const [user] = useAuthState(auth);
    const [data, setData]: any = useState([]);

    useEffect(() => {
        getFriendRequestsRecipientByEmail(user?.email!).then((res) => setData(res));
    },[])

    return (
        <Container>
            <Row>
                { data.length > 0 ? data.map((friendRequest: any) => 
                    <Col key={friendRequest.id}>
                        <FriendRequest senderEmail={friendRequest.data().senderEmail} recipientEmail={friendRequest.data().recipientEmail} />
                    </Col>
                ) : null}
            </Row>
            
        </Container>
    )
}

export default FriendRequestsListScreen;