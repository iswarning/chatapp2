import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import Image from "next/image";
import firebase from "firebase";
import { IconButton, Modal } from "@mui/material";
import AddTaskIcon from "@mui/icons-material/AddTask";
import CancelIcon from "@mui/icons-material/Cancel";
import { useState } from "react";
import UserDetailScreen from "../ProfilePage/UserDetailScreen/UserDetailScreen";
import sendNotificationFCM from "@/utils/sendNotificationFCM";
import { UserType } from "@/types/UserType";
import { useDispatch, useSelector } from "react-redux";

export default function FriendRequest({
  id,
  senderEmail,
  recipientEmail,
  userInfo,
  onDenyFR,
}: {
  id: string;
  senderEmail: string;
  recipientEmail: string;
  userInfo: UserType | undefined;
  onDenyFR: any;
}) {
  const [user] = useAuthState(auth);
  const [isOpen, setIsOpen] = useState(false);

  const [chatSnapshot] = useCollection(
    db.collection("chats").where("users", "array-contains", user?.email)
  );

  const chat = chatSnapshot?.docs?.find((chatSnap) =>
    chatSnap?.data().users.includes(recipientEmail)
  );

  const onAccept = async () => {
    await db.collection("friends").add({
      users: [senderEmail, recipientEmail],
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    const friend = await db.collection("friend_requests").doc(id).get();

    if (friend?.exists) {
      const batch = db.batch();

      batch.delete(friend.ref);

      await batch.commit();
    }

    await db.collection("chats").add({
      users: [senderEmail, recipientEmail],
      photoURL: "",
      isGroup: false,
      name: "",
      admin: "",
    });

    await sendNotificationFCM(
      "Notification",
      user?.displayName + " accepted a friend request",
      userInfo?.fcm_token
    );
  };

  const onCancel = async () => {
    const friend = await db.collection("friend_requests").doc(id).get();

    const batch = db.batch();

    batch.delete(friend.ref);

    await batch.commit();

  };

  return (
    <>
      <div
        className={
          "entry transform duration-300 transition-transform bg-white mb-4 rounded p-4 flex shadow-md"
        }
      >
        <div className="flex-2">
          <div className="w-12 h-12 relative">
            <CustomAvatar
              src={userInfo?.photoURL!}
              width={50}
              height={50}
              alt="User Avatar"
            />
          </div>
        </div>
        <div className="flex-1 px-2 ml-2">
          <div
            className="truncate w-40 cursor-pointer"
            id="hover-animation"
            data-replace="Profile"
            onClick={() => setIsOpen(true)}
          >
            <span className="text-gray-800">
              {chat?.data().isGroup
                ? "Group: " + chat?.data().name
                : userInfo?.fullName}
            </span>
          </div>
          <div className="truncate w-40">
            <small className="text-gray-600 ">Have 2 mutual friend</small>
          </div>
        </div>
        <div className="flex-2 text-right">
          <div className="flex">
            <div>
              <IconButton title="Accept" onClick={() => onAccept()}>
                <AddTaskIcon fontSize="medium" />
              </IconButton>
            </div>
            <div>
              <IconButton title="Deny" onClick={() => onCancel()}>
                <CancelIcon fontSize="medium" />
              </IconButton>
            </div>
          </div>
        </div>
      </div>
      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <UserDetailScreen userInfo={userInfo} />
      </Modal>
    </>
  );
}

export const CustomAvatar = styled(Image)`
  border-radius: 50%;
`;
