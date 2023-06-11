import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { io } from "socket.io-client";
import firebase from "firebase";
import { useEffect, useState } from "react";
import sendNotificationFCM from "@/utils/sendNotificationFCM";
import { UserType } from "@/types/UserType";

export default function User({ userInfo }: { userInfo: UserType }) {
  const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);

  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getStatusFriend();
  }, []);

  const getStatusFriend = async () => {
    let status = "isStranger";

    const fR = await db
      .collection("friend_requests")
      .where("senderEmail", "==", user?.email)
      .where("recipientEmail", "==", userInfo?.email)
      .get();

    const pA = await db
      .collection("friend_requests")
      .where("recipientEmail", "==", user?.email)
      .where("senderEmail", "==", userInfo?.email)
      .get();

    const d = await db
      .collection("friends")
      .where("users", "array-contains", user?.email)
      .get();

    if (fR?.docs?.length > 0) {
      status = "isFriendRequest";
    }

    if (pA?.docs?.length > 0) {
      if (pA?.docs?.find((f) => f.data().senderEmail === userInfo?.email)) {
        status = "isPendingAccept";
      }
    }

    if (d?.docs?.length > 0) {
      if (d?.docs?.find((f) => f.data().users.includes(userInfo?.email))) {
        status = "isFriend";
      }
    }

    if (status === "isStranger") setLoading(true);
  };

  const onAddFriend = async () => {
    await db.collection("friend_requests").add({
      senderEmail: user?.email,
      recipientEmail: userInfo?.email!,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    sendNotificationFCM(
      "Notification",
      user?.email + " sent you a friend request",
      userInfo.fcm_token
    )
  };

  return (
    <>
      {loading ? (
        <div
          className="col-xl-3 col-sm-3 m-2 mt-16 bg-white shadow-xl rounded-lg text-gray-900"
          style={{ padding: 0 }}
        >
          <div className="rounded-t-lg h-32 overflow-hidden">
            <img
              className="w-full"
              src="/images/cover-image.jpg"
              alt="Mountain"
            />
          </div>
          <div className="mx-auto w-32 h-32 relative -mt-16 border-4 border-white rounded-full overflow-hidden">
            <img
              className="object-cover object-center h-32"
              src={userInfo?.photoURL!}
              alt="Woman looking front"
            />
          </div>
          <div className="text-center mt-2">
            <h2 className="font-semibold">{userInfo?.fullName}</h2>
            <div className="text-gray-500 pb-2">Software Engineer</div>
            <div className="text-gray-500"></div>
          </div>
          <div className="p-4 border-t mt-2 mx-auto d-flex">
            <button
              className="block mx-2 rounded-full bg-gray-900 hover:shadow-lg font-semibold text-white px-4 py-2"
              onClick={onAddFriend}
            >
              Add friend
            </button>
            <button
              className="block mx-2 rounded-full hover:shadow-lg font-semibold text-black px-4 py-2"
              style={{ border: "1px solid" }}
            >
              Remove
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
