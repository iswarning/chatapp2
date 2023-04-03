import { auth, db } from "@/firebase"
import firebase from "firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { getUserById } from "./UserService";

const createFriend = ({ senderId, recipientId }: any) => {

    try {
        db
        .collection('users')
        .doc(senderId)
        .collection('friends')
        .add({
            userId: recipientId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        db
        .collection('users')
        .doc(recipientId)
        .collection('friends')
        .add({
            userId: senderId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
        console.log(error);
    }
    
}

const findFriendByKeyWord = async ({ userId, keyWord }: any) => {
    return getAllFriendCurrentUser(userId)?.filter((item) => 
        {
            let userById: firebase.firestore.DocumentData = {};
            getUserById(item.data().userId).then((user) => userById = user);
            return userById.data().email === keyWord;
        }
    )
}

const getAllFriendCurrentUser = ({ userId }: any) => {
    const [friendSnapshot] =  useCollection(
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