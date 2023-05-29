import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import FriendRequest from "../FriendRequest/FriendRequest";
import { useCollection } from "react-firebase-hooks/firestore";

function FriendRequestsListScreen() {

    const [user] = useAuthState(auth);
    
    const [friendRequestSnapshot] = useCollection(
        db
        .collection("friend_requests")
        .where("recipientEmail",'==',user?.email)
        .where("isAccepted",'==',false)
    )

    return (
        <div className="container">
            <div className='row'>
                {
                    friendRequestSnapshot ? friendRequestSnapshot?.docs?.map((fR) => 
                        <FriendRequest key={fR.id} id={fR.id} senderEmail={fR.data().senderEmail} recipientEmail={fR.data().recipientEmail} />
                    ) : null
                }
            </div>
        </div>
    )
}

export default FriendRequestsListScreen;