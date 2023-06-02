import { db } from "@/firebase";
import getRecipientEmail from "@/utils/getRecipientEmail";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

export const useFriendList = (user: any) => {

    const [friendData, setFriendData]: any[] = useState([]);

    const [friendSnapshot] = useCollection(
        db
        .collection("friends")
        .where("users",'array-contains',user?.email)
    )

    let result: any[] = [];

    friendSnapshot?.docs?.forEach((friend) => {
        (async() => {
            const userSnapshot = await db.collection("users").where("email",'==',getRecipientEmail(friend.data().users, user)).get()
            const userInfo = userSnapshot?.docs?.[0];
            result.push({
                friendId: friend.id,
                ...friend.data(),
                userId: userInfo.id,
                ...userInfo.data()
            })
        })();
    })

    setFriendData(result);

    return [friendData];
}