import firebase from "firebase";
import { UserType } from "./UserType";

export interface FriendRequestType {
  id: string;
  senderEmail: string;
  recipientEmail: string;
  createdAt: string;
  userInfo?: UserType;
}
