import { db } from "@/firebase";
import getRecipientEmail from "./getRecipientEmail";

export default async function getInitialState(user: any) {

    let initialData: any = {
        userInfo: {},
        listFriend: [],
        listFriendRequest: [],
    };

    const userInfo = await db.collection("users").doc(user?.id).get();

    initialData.userInfo = {
        id: userInfo.id,
        ...userInfo.data()
    }

    const listFriend = await db.collection("friends").where("users",'array-contains',user?.email).get();

    listFriend?.docs?.forEach((friend) => (async() => {
        let info = await db.collection("users").where("email",'==',getRecipientEmail(friend.data().users, user)).get()
        initialData.listFriend.push({ id: info?.docs?.[0]?.id, ...info?.docs?.[0]?.data() })
    }));

    const listFriendRequest = await db.collection("friend_requests").where("recipientEmail",'array-contains',user?.email).get();

    listFriendRequest?.docs?.forEach((fR) => (async() => {
        let info = await db.collection("users").where("email", '==', fR?.data().senderEmail).get()
        initialData.listFriend.push({ id: info?.docs?.[0]?.id, ...info?.docs?.[0]?.data() })
    }));

    return initialData;
}