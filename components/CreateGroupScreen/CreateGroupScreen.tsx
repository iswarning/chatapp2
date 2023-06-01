import { useEffect, useState } from "react";
import { BtnAdd, BtnBack, BtnContainer, BtnRemove, BtnViewListMember, Container, CountMemberContainer, CountMemberValue, GroupNameContainer, GroupNameInput, Label, ListMemberScreen, Search, SearchInput, SidebarContainer, TextEmail, UserAvatar, UserContainer } from "./CreateGroupScreenStyled";
import SearchIcon from '@mui/icons-material/Search';
import getAllFriendOfUser from "@/services/friends/getAllFriendOfUser";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import getRecipientEmail from "@/utils/getRecipientEmail";
import getUserByEmail from "@/services/users/getUserByEmail";
import createNewGroupChat from "@/services/chat-groups/createNewGroupChat";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Button, IconButton, Modal } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useCollection } from "react-firebase-hooks/firestore";
import Member from "./Member";

export default function CreateGroupScreen({onClose}: any) {

    const [searchInput, setSearchInput] = useState('');
    const [groupName, setGroupName] = useState('');
    const [listMember, setListMember]: any = useState([]);
    const [searchData, setSearchData]: any = useState([]);
    const [loading, setLoading] = useState(false);
    const [user] = useAuthState(auth);

    useEffect(() => {
        // const getFriendAndUserInfo = async() => {
        //     let result: Array<any> = [];
        //     const allFriend = await getAllFriendOfUser(user?.email!);
        //     if(allFriend.length > 0) { 
        //         allFriend.forEach(async(f) => {
        //             const userByEmail = await getUserByEmail(getRecipientEmail(f.data().users, user));
        //             result.push({
        //                 id: userByEmail.id,
        //                 email: userByEmail.data().email,
        //                 phoneNumber: userByEmail.data().phoneNumber,
        //                 photoURL: userByEmail.data().photoURL,
        //             })
        //         })
        //     }
        //     setFriendData(result);
        // }
        // getFriendAndUserInfo();
        // addAdminUserToGroup();
        Promise.all([friendList]).then(() => setLoading(true))
    },[])

    const [friendSnapshot] = useCollection(
        db
        .collection("friends")
        .where("users",'array-contains',user?.email)
    )

    const friendList = friendSnapshot?.docs?.map(async(friend) => {
        const userSnapshot = await db.collection("users").where("email",'==',getRecipientEmail(friend.data().users, user)).get()
        const userInfo = userSnapshot?.docs?.[0];
        return {
            friendId: friend.id,
            ...friend.data(),
            userId: userInfo.id,
            ...userInfo.data()
        }
    })

    const handleSearch = (value: any) => {
        setSearchInput(value);
        // let isPhone = Number.isNaN(value);
        // if(isPhone && value.length === 10) {
        //     let result = friendSnapshot?.docs?.map((fri) => {
                
        //     })
        //     if(result !== undefined && result.length > 0) { 
        //         setSearchData(result);
        //     } else {
        //         setSearchData([]);
        //     }
        // } else if (!isPhone && value.length > 0) {
        //     let result = friendSnapshot?.docs?.map((fri) => {
        //         return (getRecipientEmail(fri.data().users, user)).indexOf(value) !== -1
        //     })
        //     if(result !== undefined && result.length > 0) { 
        //         setSearchData(result);
        //     } else {
        //         setSearchData([]);
        //     }
        // }
    }

    const removeMember = (userInfo: any) => {
        let array = [...listMember]; // make a separate copy of the array
        let itemExist = listMember.find((mem: any) => mem.id === userInfo.id)
        if (itemExist) {
            array.splice(itemExist, 1);
            setListMember(array)
        }
    }

    const handleCheckBox = (userInfo: any, checked: boolean) => {
        if (!checked) {
            removeMember(userInfo);
        } else {
            setListMember((oldListMember: any) => [
                {
                    id: userInfo?.id, 
                    email: userInfo?.email, 
                    photoURL: userInfo?.photoURL, 
                },
                ...oldListMember
            ]);
        }
        // setSearchInput('');
    }

    const handleCreateNewGroupChat = (e: any) => {
        e.preventDefault();
        let members = listMember.map((m: any) => m.email);
        createNewGroupChat(members, '', groupName, user?.email!);
        onClose();
    }

    return (
        <>
            {
                loading ? <Container>
            <SidebarContainer >
                <Search className="py-2">
                    <SearchIcon />
                    <SearchInput placeholder='Enter phone number or email to search' value={searchInput} onChange={(e) => handleSearch(e.currentTarget.value)}/>
                </Search>
                <CountMemberContainer className={"mt-4 " + (listMember.length < 2 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800") + "  font-medium mr-2 px-3 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300"}>
                    <Label className="">Total members:</Label>
                    <CountMemberValue>&nbsp; {listMember?.length!}</CountMemberValue>
                </CountMemberContainer>
                <ListMemberScreen style={{overflowY: 'auto'}} className="py-2">
                {
                    friendList && searchInput.length === 0 ? friendList?.map((data: any) => 
                        <Member key={data.friendId} userInfo={data} onCheckBox={(userInfo: any, checked: boolean) => handleCheckBox(userInfo, checked)} />
                    ) : null
                }
                {
                    searchInput.length > 0 && searchData.length > 0 ? searchData?.map((data: any) => 
                        <Member key={data.friendId} userInfo={data} onCheckBox={(userInfo: any, checked: boolean) => handleCheckBox(userInfo, checked)} />
                    ) : null
                }
                </ListMemberScreen>
                <GroupNameContainer className="py-2">
                    <GroupNameInput title="Group Name" placeholder=" Enter group name" value={groupName} hidden={listMember?.length! < 3} onChange={(e) => setGroupName(e.target.value)}/>
                </GroupNameContainer>
                <BtnContainer className="py-2 text-center">
                    <Button
                        variant="outlined"
                        color="info" 
                        style={{display: listMember?.length! >= 2 && groupName.length >= 3 ? 'block' : 'none'}} 
                        onClick={handleCreateNewGroupChat}>Create Group
                    </Button>
                </BtnContainer>
            </SidebarContainer>
        </Container> : null
            }
        </>
        
    )
}