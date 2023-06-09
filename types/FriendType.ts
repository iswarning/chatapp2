import firebase from "firebase";
import { UserType } from "./UserType";

export interface FriendType {
  id: string;
  users: Array<string>;
  userInfo?: UserType;
}
