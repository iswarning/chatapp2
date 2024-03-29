import { MutationCreateUser, MutationPushNotify } from "@/graphql/mutations";
import { QueryFindAllUser, QueryGenerateRtcToken, QueryGetInitialDataOfUser, QueryGetUserInfoById } from "@/graphql/queries";
import { ChatType } from "@/types/ChatType";
import { FriendRequestType } from "@/types/FriendRequestType";
import { FriendType } from "@/types/FriendType";
import { NotifyResponseType } from "@/types/NotifyResponseType";
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
        if(listFriendR.length > 0) {
            listFriendR = await Promise.all(listFriendR.map(async(friend) => {
                return {
                    ...friend,
                    userInfo: await getUserById(friend.senderId)
                }
            }))
        }

        let listChatRoom: ChatType[] = response.data.data.getInitialDataOfUser.listChatRoom
        if (listChatRoom.length > 0) {
            listChatRoom = await Promise.all(listChatRoom.map(async(chatRoom) => {
                let listMember = chatRoom?.members

                let { infoByListFriend, infoByListFriendR } = findUserInInitialData(listFriend, listFriendR, listMember)
                let userInfoOfChat = {} as UserType

                if (infoByListFriend) {
                    userInfoOfChat = infoByListFriend
                } else if (infoByListFriendR) {
                    userInfoOfChat = infoByListFriendR
                }
                    
                if(chatRoom.isGroup) {
                    return {
                        ...chatRoom,
                        listRecipientInfo: await Promise.all(listMember.map(async(member) => {
                            let userInfoOfRecipient: UserType
                            if (infoByListFriend?._id === member) {
                                userInfoOfRecipient = infoByListFriend
                            } else if (infoByListFriendR?._id === member) {
                                userInfoOfRecipient = infoByListFriendR
                            } else if(response.data.data.getInitialDataOfUser.userInfo._id === member) {
                                userInfoOfRecipient = response.data.data.getInitialDataOfUser.userInfo
                            } else {
                                userInfoOfRecipient = await getUserById(member)
                            }
                            return userInfoOfRecipient
                        }))
                    }
                } else {
                    return {
                        ...chatRoom,
                        recipientInfo: userInfoOfChat
                    }
                }
            }))
        }
        
        return {
            ...response.data.data.getInitialDataOfUser,
            listFriend,
            listFriendRequest: listFriendR,
            listChatRoom
        }
    } catch (error) {
        console.log(error)
    }
    return null
}

export function findUserInInitialData(listFriend: FriendType[], listFriendR: FriendRequestType[], userIdToFind: string | string[]) {
    let infoByListFriend = listFriend.map((fr) => {
        return {
            ...fr.userInfo
        } as UserType
    }).find((info) => userIdToFind.includes(info._id!))
    let infoByListFriendR = listFriendR.map((fr) => {
        return {
            ...fr.userInfo
        } as UserType
    }).find((info) => userIdToFind.includes(info._id!))
    return {
        infoByListFriend,
        infoByListFriendR
    }
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

export async function findAllUser() {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: QueryFindAllUser,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data.data.users
    } catch (error) {
        console.log(error)
    }
    return null
}

export async function generateRtcToken(input: { chatRoomId: string }) {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: QueryGenerateRtcToken,
            variables: {
                input
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data.data.generateRtcToken
    } catch (error) {
        console.log(error)
    }
    return null
}

export async function pushNotify(input: NotifyResponseType) {
    try {
        await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: MutationPushNotify,
            variables: {
                input
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    } catch (error) {
        console.log(error)
    }
    return null
}
