import firebase from "firebase";
import { MapUserData, UserType } from "./UserType";

export interface FriendType {
  _id?: string;
  senderId: string
  recipientId: string
  createdAt?: string
  userInfo?: UserType;
}

