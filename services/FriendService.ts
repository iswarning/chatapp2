import { auth, db } from "@/firebase"
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

const createFriend = ({ userId1, userId2, email1, email2 }: any) => {

    db
    .collection('users')
    .doc(userId1)
    .collection('friends')
    .add({
        userId: userId2,
        email: email2
    });

    db
    .collection('users')
    .doc(userId2)
    .collection('friends')
    .add({
        userId: userId1,
        email: email1
    });

}

const findFriendByKeyWord = (keyWord: string, userId: string | undefined) => {
    const [friendSnapshotFiltered] = useCollection(db
    .collection('users')
    .doc(userId)
    .collection('friends')
    .where('email', '==' , keyWord));
    return friendSnapshotFiltered?.docs || undefined;
}

const getAllFriendCurrentUser = (userId: string | undefined) => {
    const [friendSnapshot] = useCollection(
        db
        .collection('users')
        .doc(userId)
        .collection('friends')
    );
    return friendSnapshot?.docs || undefined;
}

export { createFriend,
    getAllFriendCurrentUser,
    findFriendByKeyWord }