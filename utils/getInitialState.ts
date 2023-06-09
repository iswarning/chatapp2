import { db } from "@/firebase";
import getRecipientEmail from "./getRecipientEmail";
import { MapUserData, UserType } from "@/types/UserType";
import { FriendType } from "@/types/FriendType";
import { FriendRequestType } from "@/types/FriendRequestType";

export default async function getInitialState(userId: string | undefined) {
  let data = {
    userInfo: {} as UserType,
    listFriend: new Array<FriendType>(),
    listFriendRequest: new Array<FriendRequestType>(),
  };

  const userInfo = await db.collection("users").doc(userId).get();

  data.userInfo = MapUserData(userInfo);

  const listFriend = await db
    .collection("friends")
    .where("users", "array-contains", userInfo?.data()?.email)
    .get();

  for (const friend of listFriend?.docs || []) {
    let info = await db
      .collection("users")
      .where(
        "email",
        "==",
        getRecipientEmail(friend.data().users, userInfo?.data())
      )
      .get();

    let itemToPush: FriendType = {
      id: friend.data()?.id,
      users: friend.data().users,
      userInfo: MapUserData(info?.docs?.[0]),
    };

    data.listFriend.push(itemToPush);
  }
  // await Promise.all(
  //   Array.prototype.map.call(listFriend?.docs, async (friend) => {
  //     let info = await db
  //       .collection("users")
  //       .where(
  //         "email",
  //         "==",
  //         getRecipientEmail(friend.data().users, userInfo?.data())
  //       )
  //       .get();

  //     let itemToPush: FriendType = {
  //       id: info?.docs?.[0]?.id,
  //       users: info?.docs?.[0]?.data().users,
  //     };
  //     data.listFriend.push(itemToPush);
  //   })
  // );

  const listFriendRequest = await db
    .collection("friend_requests")
    .where("recipientEmail", "==", userInfo?.data()?.email)
    .get();

  for (const fR of listFriendRequest?.docs || []) {
    let info = await db
      .collection("users")
      .where("email", "==", fR?.data().senderEmail)
      .get();

    let itemToPush: FriendRequestType = {
      id: fR?.id,
      senderEmail: fR?.data().senderEmail,
      recipientEmail: fR?.data().recipientEmail,
      createdAt: fR?.data().createdAt,
      userInfo: MapUserData(info?.docs?.[0]),
    };

    data.listFriendRequest.push(itemToPush);
  }

  return data;
}
