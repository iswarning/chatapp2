import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Friend from "../Friend/Friend";
import User from "../User";

function FriendsListScreen() {

    const [user] = useAuthState(auth);
    
    const [userSnapshot] = useCollection(
        db
        .collection("users")
        .where("email",'!=',user?.email)
    )

    // const []

    // const listFriend = userSnapshot?.docs?.filter((user) =>)

    return (
        <div className="container">
            <div className='row'>
                {
                    userSnapshot ? userSnapshot?.docs?.map((user) => 
                        <User key={user?.id} user={{ id: user?.id, ...user?.data() }} />
                    ) : null
                }
            </div>
        </div>
    )
}

export default FriendsListScreen;