import { db } from "@/firebase";
import { MapUserData, UserType } from "@/types/UserType";
import { FriendType, MapFriendData } from "@/types/FriendType";
import { FriendRequestType, MapFriendRequestData } from "@/types/FriendRequestType";
import { ChatType, MapChatData } from "@/types/ChatType";
import getRecipientEmail from "./getRecipientEmail";

export default async function getInitialState(userId: string | undefined) {
  let data = {
    userInfo: {} as UserType,
    listFriend: new Array<FriendType>(),
    listFriendRequest: new Array<FriendRequestType>(),
    listChat: new Array<ChatType>(),
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
        getRecipientEmail(friend.data().users, data.userInfo)
      )
      .get();

    let itemToPush: FriendType = MapFriendData(friend, info?.docs?.[0])

    data.listFriend.push(itemToPush);
  }

  const listFriendRequest = await db
    .collection("friend_requests")
    .where("recipientEmail", "==", data.userInfo.email)
    .get();

  for (const fR of listFriendRequest?.docs || []) {
    let info = await db
      .collection("users")
      .where("email", "==", fR?.data().senderEmail)
      .get();

    let itemToPush: FriendRequestType = MapFriendRequestData(fR)
    itemToPush.userInfo = MapUserData(info?.docs?.[0])

    data.listFriendRequest.push(itemToPush);
  }

  const listChat = await db
    .collection("chats")
    .where("users", 'array-contains', data.userInfo.email)
    .get();

  for (const chat of listChat?.docs || []) {
    if(!chat.data().isGroup) {
      let info = await db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.data().users, userInfo.data()))
      .get();
    
      let item = MapChatData(chat);
      
      item.recipientInfo = MapUserData(info?.docs?.[0])
      data.listChat.push(item)
    } else {
      let item = MapChatData(chat);
      data.listChat.push(item)
    }
  }

  return data;
}
