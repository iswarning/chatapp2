import { selectAppState } from "@/redux/appSlice";
import FriendRequest from "./FriendRequest";
import { FriendRequestType } from "@/types/FriendRequestType";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function SidebarFriendRequest() {
  const appState = useSelector(selectAppState);
  const [listFriendRequest, setListFriendRequest] = useState<
    Array<FriendRequestType>
  >(appState.listFriendRequest);

  useEffect(() => {
    console.log(appState)
  },[])

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
          {listFriendRequest
            ? listFriendRequest.map((fR) => (
                <FriendRequest
                  key={fR.id}
                  id={fR.id}
                  senderEmail={fR.senderEmail}
                  recipientEmail={fR.recipientEmail}
                  userInfo={fR.userInfo}
                  onDenyFR={(newData: FriendRequestType[]) =>
                    setListFriendRequest(newData)
                  }
                />
              ))
            : null}
        </div>
      </div>
    </>
  );
}
