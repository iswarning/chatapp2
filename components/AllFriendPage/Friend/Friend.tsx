import { auth, db } from "@/firebase";
import getRecipientEmail from "@/utils/getRecipientEmail";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import Image from "next/image";
import TimeAgo from "timeago-react";
import { useEffect, useRef, useState } from "react";
import {useSelector} from 'react-redux'
import { selectAppState } from "@/redux/appSlice";

export default function Friend({ data, onShowMessage }: any) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const appState = useSelector(selectAppState)

  useEffect(() => {

  }, []);

  const [chatSnapshot] = useCollection(
    db.collection("chats").where("users", "array-contains", user?.email).where("isGroup", '==', false)
  );

  const chat = chatSnapshot?.docs?.find((c) =>
    c.data().users.includes(getRecipientEmail(data.users, user))
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(data.users, user))
  );

  const handleShowChatScreen = () => {
    onShowMessage(chat);
    setSeenMessage().catch((err) => console.log(err));
  };

  const [lastMessageSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(chat?.id)
      .collection("messages")
      .orderBy("timestamp")
      .limitToLast(1)
  );

  const lastMessage = lastMessageSnapshot?.docs?.[0]?.data();

  const setSeenMessage = async () => {
    const messageSnap = await db
      .collection("chats")
      .doc(chat?.id)
      .collection("messages")
      .get();
    if (messageSnap) {
      messageSnap?.docs?.forEach((m) => {
        (async () => {
          const msgRef = db
            .collection("chats")
            .doc(chat?.id)
            .collection("messages")
            .doc(m.id);
          const res = await msgRef.get();
          if (res?.data()?.user === user?.email) return;
          if (res?.data()?.seen?.includes(user?.email)) return;
          let result = res?.data()?.seen;
          result.push(user?.email);
          await msgRef.set({ ...res.data(), seen: result });
        })();
      });
    }
  };

  return (
    <div
      className={
        "entry cursor-pointer transform hover:scale-105 duration-300 transition-transform bg-white mb-4 rounded p-4 flex shadow-md"
        // (active ? " border-l-4 border-red-500" : "")
      }
      onClick={handleShowChatScreen}
    >
      <div className="flex-2">
        <div className="w-12 h-12 relative">
          <CustomAvatar
            src={recipientSnapshot?.docs?.[0]?.data()?.photoURL}
            width={50}
            height={50}
            alt="User Avatar"
          />
          {
            appState.userOnline?.find((u: string) => u === recipientSnapshot?.docs?.[0]?.data().email) ? (
              <span className="absolute w-4 h-4 bg-green-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
            ) : (
              <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
            )
          }
        </div>
      </div>
      <div className="flex-1 px-3">
        <div className="truncate w-40">
          <span className="text-gray-800">
            {chat?.data().isGroup
              ? "Group: " + chat.data().name
              : recipientSnapshot?.docs?.[0].data().fullName}
          </span>
        </div>
        <div className="truncate w-40">
          <small className="text-gray-600 "></small>
        </div>
      </div>
      <div className="flex-2 text-right">
        <div>
          <small className="text-gray-500">
            <div className="pb-2">
              {lastMessageSnapshot?.docs.length! > 0 ? (
                lastMessage?.timestamp?.toDate() ? (
                  <TimeAgo datetime={lastMessage?.timestamp?.toDate()} />
                ) : (
                  "Unavailable"
                )
              ) : null}
            </div>
          </small>
        </div>
        <div>
          {lastMessage?.message?.length > 0 &&
          lastMessage?.user !== user?.email ? (
            lastMessage?.seen.find(
              (userSeen: string) => userSeen === user?.email
            ) ? null : (
              <small className="text-sm bg-blue-500 mb-1 rounded-full h-3 w-3 leading-4 text-center inline-block"></small>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
}

export const CustomAvatar = styled(Image)`
  border-radius: 50%;
`;
