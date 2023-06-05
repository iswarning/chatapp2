import { IconButton, Modal } from "@mui/material";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useEffect, useState } from "react";
import CreateGroupScreen from "./CreateGroupScreen/CreateGroupScreen";
import styled from "styled-components";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import getRecipientEmail from "@/utils/getRecipientEmail";

export default function Header() {
    
    const [isOpen, setIsOpen] = useState(false);
    const [user] = useAuthState(auth);
    const [friendList, setFriendList]: any = useState([]);

    useEffect(() => {
        
    },[])

    // const [friendSnapshot] = useCollection(
    //     db
    //     .collection("friends")
    //     .where("users",'array-contains',user?.email)
    // )

    // async function getFriendList() {
    //     let result: any[] = [];

    //     friendSnapshot?.docs?.forEach(async(friend) => {
    //         const userSnapshot = await db.collection("users").where("email",'==',getRecipientEmail(friend.data().users, user)).get()
    //         const userInfo = userSnapshot?.docs?.[0];
    //         result.push({
    //             friendId: friend.id,
    //             ...friend.data(),
    //             userId: userInfo.id,
    //             ...userInfo.data()
    //         })
             
    //     })
        
    //     return result;
    // }
    
    return (
        <div className="py-4 flex-2 flex flex-row">
            <div className="flex-1">
                <span className="xl:hidden inline-block text-gray-700 hover:text-gray-900 align-bottom">
                    <span className="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                        <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </span>
                </span>
                <span className="lg:hidden inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom">
                    <span className="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                        <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    </span>
                </span>
            </div>
            <div className="flex-1 text-right">
                <span className="inline-block text-gray-700">
                    <IconButton onClick={() => setIsOpen(true)}>
                        <GroupAddIcon titleAccess='Create Group Chat'/>
                    </IconButton>
                </span>
            </div>
            <Modal open={isOpen} onClose={() => setIsOpen(false)} >
                <ModalContainer>
                    <h3 className="text-center">Create New Group Chat</h3>
                    <CreateGroupScreen onClose={() => setIsOpen(false)} />
                </ModalContainer>
            </Modal>
        </div>
    );
}

const ModalContainer = styled.article`
    width: 400px;
    height: 700px;
    background: white;
    margin-left: auto;
    margin-right: auto;
    margin-top: 60px;
    border-radius: 10px;
    padding: 30px;
`