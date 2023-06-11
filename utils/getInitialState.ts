import { db } from "@/firebase";
import getRecipientEmail from "./getRecipientEmail";
import { MapUserData, UserType } from "@/types/UserType";
import { FriendType, MapFriendData } from "@/types/FriendType";
import { FriendRequestType, MapFriendRequestData } from "@/types/FriendRequestType";
import { ChatType, MapChatData } from "@/types/ChatType";
import { MapMessageData, MessageType } from "@/types/MessageType";
import { MapReactionData, ReactionType } from "@/types/ReactionType";
import { ImageInMessageType, MapImageInMessageData } from "@/types/ImageInMessageType";

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
        getRecipientEmail(friend.data().users, userInfo?.data())
      )
      .get();

    let itemToPush: FriendType = MapFriendData(friend, info?.docs?.[0])

    data.listFriend.push(itemToPush);
  }

  const listFriendRequest = await db
    .collection("friend_requests")
    .where("recipientEmail", "==", userInfo?.data()?.email)
    .get();

  for (const fR of listFriendRequest?.docs || []) {
    let info = await db
      .collection("users")
      .where("email", "==", fR?.data().senderEmail)
      .get();

    let itemToPush: FriendRequestType = MapFriendRequestData(fR, info?.docs?.[0])

    data.listFriendRequest.push(itemToPush);
  }

  data.listChat = await getListChat(userInfo?.data()?.email)

  return data;
}

const getListChat = async(email: string): Promise<Array<ChatType>> => {

  let result = new Array<ChatType>();

  const listChat = await db
    .collection("chats")
    .where("users", "array-contains", email)
    .get();

  for (const item of listChat?.docs || []) {

    let chatItem = MapChatData(item);

    let recipientInfo = await db
    .collection("users")
    .where("email",'==', getRecipientEmail(item.data().users, { email }) )
    .get()

    chatItem.recipientInfo = MapUserData(recipientInfo?.docs?.[0])
    chatItem.messages = await getListMessage(item.id)

    result.push(chatItem)
  }

  return result;

}

const getListMessage = async(chatId: string): Promise<Array<MessageType>> => {

  let result = new Array<MessageType>();

  let messages = await db
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .get();

  for (const item of messages?.docs || []) { 
    let messItem = MapMessageData(item);
    let userInfo = await db.collection("users").where("email",'==',messItem.user).get()
    messItem.userInfo = MapUserData(userInfo?.docs?.[0])
    messItem.reaction = await getListReaction(chatId, item.id)
    messItem.imageInMessage = await getListImageInMessage(chatId, item.id)
    result?.push(messItem);
  }

  return result;
  
}

const getListReaction = async(chatId: string, messId: string): Promise<Array<ReactionType> | undefined> => {

  let result = new Array<ReactionType>();

  let reactions = await db
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .doc(messId)
    .collection("reaction")
    .get();

  for (const item of reactions?.docs || []) { 
    result?.push(MapReactionData(item));
  }

  return result.length > 0 ? result : undefined;
  
}

const getListImageInMessage = async(chatId: string,messId: string): Promise<Array<ImageInMessageType> | undefined> => {

  let result = new Array<ImageInMessageType>();

  let imageInMessage = await db
    .collection("chats")
    .doc(chatId)
    .collection("messages")
    .doc(messId)
    .collection("imageInMessage")
    .get();

  for (const item of imageInMessage?.docs || []) { 
    result?.push(MapImageInMessageData(item));
  }

  return result.length > 0 ? result : undefined;
  
}
