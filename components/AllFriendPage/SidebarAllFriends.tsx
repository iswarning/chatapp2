import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "@/firebase";
import ChatScreen from "../ChatPage/ChatScreen/ChatScreen";
import { useQuery } from "@tanstack/react-query";
import Friend from "./Friend/Friend";

export default function SidebarMessage() {
  const [user] = useAuthState(auth);
  const [chatInfo, setChatInfo] = useState<any>(null);
  const [messData, setMessData] = useState<any>(null);

  const [friendListSnapshot] = useCollection(
    db.collection("friends").where("users", "array-contains", user?.email)
  );

  const showMessage = (chat: any) => {
    setChatInfo(chat);
    getMessage(chat?.id);
  };

  const getMessage = async (id: string) => {
    const snap = await db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .get();
    setMessData(snap);
  };

  return (
    <>
      <div className="sidebar hidden lg:flex w-1/3 flex-2 flex-col pr-6">
        <div className="search flex-2 pb-6 px-2">
          <input
            type="text"
            className="outline-none py-2 block w-full bg-transparent border-b-2 border-gray-200"
            placeholder="Search"
          />
        </div>
        <div
          className="flex-1 overflow-y-scroll h-screen p-2"
          id="scroll-style-3"
        >
          {friendListSnapshot
            ? friendListSnapshot?.docs?.map((friend) => (
                <Friend
                  key={friend.id}
                  data={{ id: friend.id, ...friend.data() }}
                  onSendMessage={(chat: any) => showMessage(chat)}
                />
              ))
            : null}
        </div>
      </div>
      {chatInfo ? (
        <ChatScreen
          key={chatInfo.id}
          chat={{ id: chatInfo.id, ...chatInfo.data() }}
          messages={messData}
        />
      ) : null}
    </>
  );
}
