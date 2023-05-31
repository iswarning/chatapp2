import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import User from "../User";
import styled from "styled-components";

function SuggestionScreen() {

    const [user] = useAuthState(auth);

    const [userSnapshot] = useCollection(
        db
        .collection("users")
        .where("email",'!=',user?.email)
    )

    return (
        <Container>
            <div className='row'>
                {
                    userSnapshot ? userSnapshot?.docs?.map((user: any) => 
                        <User key={user?.id} userInfo={{ id: user?.id, ...user?.data() }} />
                    ) : null
                }
            </div>
        </Container>
    )
}

const Container = styled.div.attrs(() => ({
    className: 'container py-4'
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
`

export default SuggestionScreen;