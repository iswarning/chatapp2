import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import ChatScreen from "../ChatScreen/ChatScreen";
import UserOnlineComponent from "@/components/UserOnlineComponent";
import { MapChatData } from "@/types/ChatType";
import ChatComponent from "../ChatComponent";
import { useSelector } from 'react-redux'
import { selectAppState } from "@/redux/appSlice";
import { v4 as uuidv4 } from 'uuid';

export default function SidebarMessage() {
  const [user] = useAuthState(auth);
  const [chatInfo, setChatInfo] = useState<any>(null);
  const [messData, setMessData] = useState<any>(null);
  const appState = useSelector(selectAppState)

  const [chatSnapshot] = useCollection(
    db.collection("chats").where("users", "array-contains", user?.email)
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
      {/* <div className="sidebar hidden lg:flex w-1/3 flex-2 flex-col pr-6">
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
          {chatSnapshot?.docs?.length! > 0
            ? chatSnapshot?.docs?.map((chat) => (
                <Chat
                  key={chat.id}
                  chat={{
                    id: chat.id,
                    ...chat.data(),
                  }}
                  onShowMessage={() => showMessage(chat)}
                  active={chatInfo?.id === chat.id}
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
      ) : null} */}
      <div className="side-content col-span-12 xl:col-span-3 -mt-16 xl:mt-0 pt-20 xl:-mr-6 px-6 xl:pt-6 side-content--active flex-col overflow-hidden" data-content="chats">
<div className="intro-y text-xl font-medium">Chats</div>
<div className="intro-y relative mt-5">
<input type="text" className="form-control box py-3 px-4 border-transparent pr-8" placeholder="Search for messages or users..."/>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="feather feather-search text-gray-600 w-5 h-5 absolute inset-y-0 right-0 my-auto mr-3"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
</div>
<div className="intro-y flex-none overflow-x-auto overflow-y-hidden scrollbar-hidden">
<div className="flex mt-6">
{appState.userOnline.length > 0
  ? appState.userOnline.map((userOn) => (
      <UserOnlineComponent
        key={uuidv4()}
        userOn={userOn}
      />
    ))
: null}

</div>
</div>
<div className="intro-y text-base font-medium leading-tight mt-3">Recent Chats</div>
<div className="intro-y overflow-y-auto scrollbar-hidden pt-2 mt-3 -mx-5 px-5">
{chatSnapshot?.docs?.length! > 0
  ? chatSnapshot?.docs?.map((chat) => (
      <ChatComponent
        key={chat.id}
        chat={MapChatData(chat)}
        onShowMessage={() => showMessage(chat)}
        active={chatInfo?.id === chat.id}
      />
    ))
: null}
</div>
</div>
    </>
  );
}
