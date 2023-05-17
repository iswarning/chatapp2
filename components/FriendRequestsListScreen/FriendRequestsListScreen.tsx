import { useEffect, useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import FriendRequest from "../FriendRequest/FriendRequest";
import getFriendRequestsRecipientByEmail from "@/services/friend-requests/getFriendRequestsRecipientByEmail";
import { Row } from "../FriendsListScreen/FriendsListScreenStyled";
import { Col } from "./FriendRequestsListScreenStyled";

function FriendRequestsListScreen() {

    const [user] = useAuthState(auth);
    const [data, setData]: any = useState([]);

    useEffect(() => {
        getFriendRequest()
    },[])

    const getFriendRequest = () => {
        getFriendRequestsRecipientByEmail(user?.email!)
        .then((res) => setData(res));
    }

    return (
        <Row>
            { data.length > 0 ? data.map((friendRequest: any) => 
                <Col key={friendRequest.id}>
                    <FriendRequest senderEmail={friendRequest.data().senderEmail} recipientEmail={friendRequest.data().recipientEmail} onGetFriendRequest={getFriendRequest} />
                </Col>
            ) : null}
        </Row>
    )
}

export default FriendRequestsListScreen;