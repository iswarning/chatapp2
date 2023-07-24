
import {UserType } from "./UserType";

export interface FriendRequestType {
  _id?: string;
  senderId: string;
  recipientId: string;
  createdAt?: string;
  userInfo?: UserType;
}

