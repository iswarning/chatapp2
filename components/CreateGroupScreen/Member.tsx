import { useCollection, useCollectionOnce } from "react-firebase-hooks/firestore";
import { TextEmail, UserAvatar, UserContainer } from "./CreateGroupScreenStyled";
import { db } from "@/firebase";

export default function Member({email, onCheckBox, listMember}: any) {

    const [userSnapshot] = useCollection(db.collection("users").where("email", '==', email));
    const userInfo = userSnapshot?.docs?.[0];

    return (
        <UserContainer>
            <UserAvatar src={userInfo?.data().photoURL} />
            <TextEmail htmlFor={userInfo?.id}>{userInfo?.data().fullName}</TextEmail>&nbsp;
            <input
                id={userInfo?.id} 
                type="checkbox" 
                name={userInfo?.data().email} 
                className="ml-auto" 
                onChange={(e) => onCheckBox({ id: userInfo?.id, ...userInfo?.data() }, e.target.checked)} 
                checked={listMember.find((mem: any) => mem.id === userInfo?.id)} />
        </UserContainer>
    )
}