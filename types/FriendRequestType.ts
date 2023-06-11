import firebase from "firebase";
import { MapUserData, UserType } from "./UserType";

export interface FriendRequestType {
  id: string;
  senderEmail: string;
  recipientEmail: string;
  createdAt: string;
  userInfo?: UserType;
}

export const MapFriendRequestData = (fR: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>, userInfo: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>): FriendRequestType => {
  let fRData: FriendRequestType = {} as FriendRequestType; 
  fRData.id = fR?.id;
  fRData.senderEmail = fR?.data()?.senderEmail;
  fRData.recipientEmail = fR?.data()?.recipientEmail;
  fRData.createdAt = fR?.data()?.createdAt;
  fRData.userInfo = MapUserData(userInfo);
  return fRData;
}

