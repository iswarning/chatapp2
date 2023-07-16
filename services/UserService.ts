import { MutationCreateUser } from "@/graphql/mutations";
import { QueryGetInitialDataOfUser, QueryGetUserInfoById } from "@/graphql/queries";
import { ChatType } from "@/types/ChatType";
import { FriendRequestType } from "@/types/FriendRequestType";
import { FriendType } from "@/types/FriendType";
import { UserType } from "@/types/UserType";
import axios from "axios";

export async function getInitialDataOfUser(userId: string) {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: QueryGetInitialDataOfUser,
            variables: {
                userId
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let listFriend: FriendType[] = response.data.data.getInitialDataOfUser.listFriend
        if(listFriend.length > 0) {
            listFriend = await Promise.all(listFriend.map(async(friend) => {
                let recipientId = friend.senderId === userId ? friend.recipientId : friend.senderId
                return {
                    ...friend,
                    userInfo: await getUserById(recipientId)
                }
            }))
        }
        
        let listFriendR: FriendRequestType[] = response.data.data.getInitialDataOfUser.listFriendRequest
        console.log(listFriendR)
        if(listFriendR.length > 0) {
            listFriendR = await Promise.all(listFriendR.map(async(friend) => {
                return {
                    ...friend,
                    userInfo: await getUserById(friend.senderId)
                }
            }))
        }
        console.log(listFriendR)

        let listChatRoom: ChatType[] = response.data.data.getInitialDataOfUser.listChatRoom
        if (listChatRoom.length > 0) {
            listChatRoom = await Promise.all(listChatRoom.map(async(chatRoom) => {
                let listMember = chatRoom?.members
                let infoByListFriend = listFriend.map((fr) => {
                    return {
                        ...fr.userInfo
                    }
                }).find((info) => listMember.includes(info._id!))
                let infoByListFriendR = listFriendR.map((fr) => {
                    return {
                        ...fr.userInfo
                    }
                }).find((info) => listMember.includes(info._id!))
                if(chatRoom.isGroup) {
                    return {
                        ...chatRoom,
                        listRecipientInfo: await Promise.all(listMember.map(async(member) => {
                            const userInfo = await getUserById(member)
                            if(member !== userId) {
                                return {
                                    _id: member,
                                    ...userInfo
                                }
                            }
                        }))
                    }
                } else {
                    return {
                        ...chatRoom,
                        recipientInfo: infoByListFriend ? infoByListFriend : infoByListFriendR ? infoByListFriendR : await getUserById(listMember.find((m) => m !== userId)!)
                    }
                }
            }))
        }
        
        return {
            ...response.data.data.getInitialDataOfUser,
            listFriend: listFriend,
            listFriendRequest: listFriendR,
            listChatRoom
        }
    } catch (error) {
        console.log(error)
    }
    return null
}

export async function getUserById(_id: string) {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: QueryGetUserInfoById,
            variables: {
                _id
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data.data.user
    } catch (error) {
        console.log(error)
    }
    return null
}

export async function createNewUser(input: UserType) {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: MutationCreateUser,
            variables: {
                createUserInput: {
                    ...input
                }
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data.data.createUser
    } catch (error) {
        console.log(error)
    }
    return null
}
