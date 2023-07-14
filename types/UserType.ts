import firebase from "firebase";

export interface UserType {
  _id: string;
  email: string;
  photoURL: string;
  fullName: string;
  phoneNumber: string;
  fcm_token: string;
}

export function MapUserData(
  userInfo: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData>
): UserType {
  let user: UserType = {} as UserType;
  user._id = userInfo?.id;
  user.email = userInfo?.data()?.email;
  user.photoURL = userInfo?.data()?.photoURL;
  user.fullName = userInfo?.data()?.fullName;
  user.phoneNumber = userInfo?.data()?.phoneNumber;
  user.fcm_token = userInfo?.data()?.fcm_token;
  return user;
}

// const emptyUser = (): UserType => ({
//   id: "",
//   email: "",
//   photoURL: "",
//   fullName: "",
//   phoneNumber: "",
//   fcm_token: "",
// });

// export const createUser = <T extends Partial<UserType>>(
//   initialValues: T
// ): UserType & T => {
//   return Object.assign(emptyUser(), initialValues);
// };
