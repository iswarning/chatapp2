import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Friend from "../Friend/Friend";

function FriendsListScreen() {

    const [user] = useAuthState(auth);
    
    const [friendListSnapshot] = useCollection(
        db
        .collection("friends")
        .where("users",'array-contains',user?.email)
    )

    return (
        <div className="container">
            <div className='row'>
                {
                    friendListSnapshot ? friendListSnapshot?.docs?.map((friend) => 
                        <Friend key={friend.id} data={{ id: friend.id, ...friend.data() }} />
                    ) : null
                }
            </div>
        </div>
    )
}

export default FriendsListScreen;