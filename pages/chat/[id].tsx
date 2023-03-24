import { ChatScreen } from "@/components/ChatScreen";
import Sidebar from "@/components/Sidebar";
import { db } from "@/firebase";
import { collection, getDoc, query, documentId, doc, orderBy } from "firebase/firestore/lite";
import Head from "next/head";
import styled from "styled-components";

export const Chat = () => {
    return (
        <Container>
            <Head>
            <title>Chat</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen />
            </ChatContainer>
        </Container>
    );
}

export async function getServerSideProps(context: any) {
    const ref = await getDoc(doc(collection(db, 'chats', context.query.id)));
    const messages = ref.data()?.messages;
    const order = messages.orderBy('timestamp', 'asc');
    
    
}

const Container = styled.div`
    display: flex;
`;
const ChatContainer = styled.div`
    flex: 1;
    overflow: scroll;
    height: 100vh;

    ::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
`;