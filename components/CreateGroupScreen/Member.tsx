import { useCollection, useCollectionOnce } from "react-firebase-hooks/firestore";
import { TextEmail, UserAvatar, UserContainer } from "./CreateGroupScreenStyled";
import { db } from "@/firebase";

export default function Member({userInfo, onCheckBox}: any) {

    

    return (
        <UserContainer>
            {userInfo?.userId + 11111}
            <UserAvatar src={userInfo?.photoURL} />
            <TextEmail htmlFor={userInfo?.userId}>{userInfo?.fullName}</TextEmail>&nbsp;
            <input
                id={userInfo?.userId} 
                type="checkbox" 
                name={userInfo?.email} 
                className="ml-auto" 
                onChange={(e) => onCheckBox({ id: userInfo?.userId, ...userInfo }, e.target.checked)}  />
        </UserContainer>
    )
}