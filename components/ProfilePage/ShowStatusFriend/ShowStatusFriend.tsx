import { auth, db } from "@/firebase";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase from "firebase";
import { io } from "socket.io-client";
import sendNotificationFCM from "@/utils/sendNotificationFCM";
import { useRouter } from "next/router";

export default function ShowStatusFriend({ userInfo, statusFriend }: any) {
  const [user] = useAuthState(auth);
  const [status, setStatus] = useState(statusFriend);
  const router = useRouter();

  const onAddFriend = async () => {
    await db.collection("friend_requests").add({
      senderEmail: user?.email,
      recipientEmail: userInfo?.email!,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setStatus("isFriendRequest");
    sendNotificationFCM(
      "Notification",
      user?.displayName + "sent a friend request",
      userInfo?.fcm_token
    ).catch((err) => console.log(err));
  };

  const onCancelFriendRequest = async () => {
    const fR = await db
      .collection("friend_requests")
      .where("senderEmail", "==", user?.email)
      .where("recipientEmail", "==", userInfo?.email)
      .get();

    const batch = db.batch();

    batch.delete(fR?.docs?.[0]?.ref);

    await batch.commit();

    setStatus("isStranger");
  };

  const onUnFriend = async () => {
    if (confirm("Do you want to unfriend?")) {
      const friendSnapshot = await db
        .collection("friends")
        .where("users", "array-contains", user?.email)
        .get();
      if (friendSnapshot) {
        const isFriend = friendSnapshot?.docs?.find((f) =>
          f.data().users.includes(userInfo?.email)
        );

        if (isFriend?.exists) {
          const batch = db.batch();

          batch.delete(isFriend?.ref);

          await batch.commit();

          setStatus("isStranger");
        }
      }
    }
  };

  const showStatusFriend = () => {
    switch (status.length > 0 ? status : statusFriend) {
      case "isStranger":
        return (
          <>
            <button
              className="bg-gray-900 hover:shadow-lg font-semibold text-white flex-1 rounded-full text-white antialiased px-4 py-2"
              onClick={onAddFriend}
            >
              Add friend
            </button>
            <button className="flex-1 rounded-full border-2 border-gray-400 font-semibold text-black px-4 py-2">
              Chat
            </button>
          </>
        );
      case "isFriendRequest":
        return (
          <>
            <button
              className="bg-gray-900 hover:shadow-lg font-semibold text-white flex-1 rounded-full text-white antialiased px-4 py-2"
              onClick={onCancelFriendRequest}
            >
              Cancel Request
            </button>
            <button
              className="flex-1 rounded-full border-2 border-gray-400 font-semibold text-black px-4 py-2"
              onClick={onCancelFriendRequest}
            >
              Chat
            </button>
          </>
        );
      case "isFriend":
        return (
          <>
            <button
              className="bg-gray-900 hover:shadow-lg font-semibold text-white flex-1 rounded-full text-white antialiased px-4 py-2"
              onClick={onUnFriend}
            >
              Unfriend
            </button>
            <button
              className="flex-1 rounded-full border-2 border-gray-400 font-semibold text-black px-4 py-2"
              onClick={onUnFriend}
            >
              Chat
            </button>
          </>
        );
      case "isPendingAccept":
        return (
          <>
            <button
              className="bg-gray-900 hover:shadow-lg font-semibold text-white flex-1 rounded-full text-white antialiased px-4 py-2"
              disabled
            >
              Pending Accept
            </button>
            <button
              className="flex-1 rounded-full border-2 border-gray-400 font-semibold text-black px-4 py-2"
              onClick={onCancelFriendRequest}
            >
              Chat
            </button>
          </>
        );
    }
  };

  return <>{showStatusFriend()}</>;
}
