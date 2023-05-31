import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import FriendRequest from "../FriendRequest/FriendRequest";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";

function FriendRequestsListScreen() {

    const [user] = useAuthState(auth);
    
    const [friendRequestSnapshot] = useCollection(
        db
        .collection("friend_requests")
        .where("recipientEmail",'==',user?.email)
    )

    return (
        <Container>
            <div className='row'>
                {
                    friendRequestSnapshot ? friendRequestSnapshot?.docs?.map((fR) => 
                        <FriendRequest key={fR.id} id={fR.id} senderEmail={fR.data().senderEmail} recipientEmail={fR.data().recipientEmail} />
                    ) : null
                }
            </div>
        </Container>
    )
}

const Container = styled.div.attrs(() => ({
    className: 'container py-4'
}))`
    max-height: 690px;
    flex: 1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`

export default FriendRequestsListScreen;