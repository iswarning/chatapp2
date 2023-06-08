import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "@/firebase";

export default function SidebarFriendRequest() {
  const [user] = useAuthState(auth);

  const [friendRequestSnapshot] = useCollection(
    db.collection("friend_requests").where("recipientEmail", "==", user?.email)
  );

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
          {/* {friendRequestSnapshot
            ? friendRequestSnapshot?.docs?.map((fR) => (
                <FriendRequest
                  key={fR.id}
                  id={fR.id}
                  senderEmail={fR.data().senderEmail}
                  recipientEmail={fR.data().recipientEmail}
                />
              ))
            : null} */}
        </div>
      </div>
    </>
  );
}
