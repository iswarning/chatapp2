import { db } from "@/firebase";
import { MapUserData, UserType } from "@/types/UserType";
import { FriendType, MapFriendData } from "@/types/FriendType";
import { FriendRequestType, MapFriendRequestData } from "@/types/FriendRequestType";
import { ChatType, FileInfo, MapChatData } from "@/types/ChatType";
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
  console.log(data)
  const listChat = await db
    .collection("chats")
    .where("users", 'array-contains', data.userInfo.email)
    .get()

  for (const chat of listChat?.docs || []) {
    let info = {} as UserType
    let listInfo = []
    if (chat.data().isGroup) {
      for(const recipientEmail of chat.data().users) {     
        if (recipientEmail !== userInfo?.data()?.email) {
          const infoByFriend = data.listFriend.find((f) => f.userInfo?.email === recipientEmail) ?? null
          const infoByFriendRequest = data.listFriendRequest.find((fR) => fR.userInfo?.email === recipientEmail) ?? null
          if (!infoByFriend && !infoByFriendRequest) {
            const snapshot = await db.collection("users").where("email", "==", recipientEmail).get()
            listInfo.push(MapUserData(snapshot.docs?.[0]));
          } else {
            listInfo.push(infoByFriend?.userInfo ?? infoByFriendRequest?.userInfo!)
          }
        }
      }
    } else {
      let recipientEmail = getRecipientEmail(chat.data().users, userInfo.data())
      const infoByFriend = data.listFriend.find((f) => f.userInfo?.email === recipientEmail) ?? null
      const infoByFriendRequest = data.listFriendRequest.find((fR) => fR.userInfo?.email === recipientEmail) ?? null
      if (!infoByFriend && !infoByFriendRequest) {
        const snapshot = await db.collection("users").where("email", "==", recipientEmail).get()
        info = MapUserData(snapshot.docs?.[0]);
      } else {
        info = infoByFriend?.userInfo ?? infoByFriendRequest?.userInfo!
      }
    }
   

    data.listChat.push({
      ...MapChatData(chat),
      recipientInfo: info,
      listRecipientInfo: listInfo
    })
    
  }
  console.log(data.listChat) 
  return data;
}
