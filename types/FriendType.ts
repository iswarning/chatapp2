import { UserType } from "./UserType";

export interface FriendType {
  _id?: string;
  senderId: string
  recipientId: string
  createdAt?: string
  userInfo?: UserType;
}

