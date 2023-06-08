import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import Friend from "../Friend/Friend";
import styled from "styled-components";

function FriendsListScreen() {
  const [user] = useAuthState(auth);

  const [friendListSnapshot] = useCollection(
    db.collection("friends").where("users", "array-contains", user?.email)
  );

  return (
    <Container>
      <div className="row">
        {friendListSnapshot
          ? friendListSnapshot?.docs?.map((friend) => (
              <Friend
                key={friend.id}
                data={{ id: friend.id, ...friend.data() }}
              />
            ))
          : null}
      </div>
    </Container>
  );
}

const Container = styled.div.attrs(() => ({
  className: "container py-4",
}))`
  max-height: 690px;
  flex: 1;
  overflow: scroll;
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export default FriendsListScreen;
