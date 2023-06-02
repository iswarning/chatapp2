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
import ItemFilter from "./ItemFilter";
import { userInfo } from "os";

export default function CreateGroupScreen({onClose, friendData}: any) {

    const [searchInput, setSearchInput] = useState('');
    const [groupName, setGroupName] = useState('');
    const [listMember, setListMember]: any = useState([]);
    const [friendList, setFriendList]: any = useState([]);
    const [searchData, setSearchData]: any = useState([]);
    // const [loading, setLoading] = useState(false);
    const [user] = useAuthState(auth);

    useEffect(() => {
        if(searchInput.length === 1) {
            getFriendList().then((data) => setFriendList(data)).catch(err => console.log(err))
        }
    },[searchInput])
    
    const [friendSnapshot] = useCollection(
        db
        .collection("friends")
        .where("users",'array-contains',user?.email)
    )

    async function getFriendList() {
        let result: any[] = [];

        friendSnapshot?.docs?.forEach((friend) => {
            (async() => {
                const userSnapshot = await db.collection("users").where("email",'==',getRecipientEmail(friend.data().users, user)).get()
                const userInfo = userSnapshot?.docs?.[0];
                result.push({
                    friendId: friend.id,
                    ...friend.data(),
                    userId: userInfo.id,
                    ...userInfo.data()
                })
            })();
        })

        return result;
    }

    const showFriendList = () => {
        if (friendList.length > 0) {
            if(searchInput.length === 0) {
                return friendList  ? friendList?.map((data: any) => 
                            <ItemFilter key={data.id} userInfo={data} onCheckBox={(userInfo: any, checked: boolean) => handleCheckBox(userInfo, checked)} checked={listMember?.find((mem: any) => mem.id === data.userId)} />
                        ) : null
            } else {
                return searchData ? searchData?.map((data: any) => 
                            <ItemFilter key={data.id} userInfo={data} onCheckBox={(userInfo: any, checked: boolean) => handleCheckBox(userInfo, checked)} checked={listMember?.find((mem: any) => mem.id === data.userId)} />
                        ) : null
            }
        } else {
            if(searchInput.length === 0) { 
                return friendSnapshot ? friendSnapshot?.docs?.map((data: any) => 
                            <Member key={data.id} email={getRecipientEmail(data.data().users, user)} onCheckBox={(userInfo: any, checked: boolean) => handleCheckBox(userInfo, checked)} listMember={listMember} />
                        ) : null
            } else {
                return searchData ? searchData?.map((data: any) => 
                            <ItemFilter key={data.id} userInfo={data} onCheckBox={(userInfo: any, checked: boolean) => handleCheckBox(userInfo, checked)} checked={listMember?.find((mem: any) => mem.id === data.userId)} />
                        ) : null
                }
            
        }
    }

    const isPhoneNumber = (str: string) => {
        for (let i = 0; i < str.length; i++) {
            if(Number.isNaN(Number(str.charAt(i)))) {
                return false;
            } 
        }
        return true
    }

    const handleSearch = (value: string) => {
        setSearchInput(value);
        if(value.length > 0) {
            if(isPhoneNumber(value)) {
                let result = friendList?.filter((u: any) => {
                    return u?.phoneNumber?.indexOf(value) !== -1
                });
                if(result !== undefined && result.length > 0) { 
                    setSearchData(result);
                } else {
                    setSearchData([]);
                }
            } else {
                let result = friendList?.filter((u: any) => {
                    return u?.email?.indexOf(value) !== -1
                });
                if(result !== undefined && result.length > 0) { 
                    setSearchData(result);
                } else {
                    setSearchData([]);
                }
            }
        } else {
            // getFriendList().then((data) => setFriendList(data)).catch(err => console.log(err))
        }
    }

    const removeMember = (userInfo: any) => {
        console.log(listMember.length)
        let array = [...listMember]; // make a separate copy of the array
        let itemExist = listMember.find((mem: any) => mem.id === userInfo.id)
        if(listMember.length === 1) {
            setListMember([]); return;
        }
        if (itemExist) {
            array.splice(itemExist, 1);
            setListMember(array)
        }
    }

    const handleCheckBox = (userInfo: any, checked: boolean) => {
        console.log(userInfo, checked);
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
         <Container>
            <SidebarContainer >
                <Search className="py-2">
                    <SearchIcon />
                    <SearchInput placeholder='Enter phone number or email to search' value={searchInput} onChange={(e) => handleSearch(e.target.value)}/>
                </Search>
                <CountMemberContainer className="mt-4 font-medium mr-2 px-3 py-0.5">
                    <Label className="">Total members:</Label>
                    <CountMemberValue>&nbsp; {listMember?.length!}</CountMemberValue>
                </CountMemberContainer>
                <ListMemberScreen style={{overflowY: 'auto'}} className="py-2">
                {
                    showFriendList()
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
        </Container>
        </>
        
    )
}