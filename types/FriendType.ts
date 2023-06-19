import firebase from "firebase";
import { MapUserData, UserType } from "./UserType";

export interface FriendType {
  id: string;
  users: Array<string>;
  userInfo?: UserType;
}

export const MapFriendData = (friend: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>, userInfo: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): FriendType => {
  let friendData: FriendType = {} as FriendType; 
  friendData.id = friend?.id;
  friendData.users = friend?.data()?.users;
  friendData.userInfo = MapUserData(userInfo)
  return friendData
}
