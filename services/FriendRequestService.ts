import { MutationCreateFriendRequest, MutationRemoveFriendRequest } from "@/graphql/mutations"
import { FriendRequestType } from "@/types/FriendRequestType"
import axios from "axios"

export async function deleteFR(_id: string) {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: MutationRemoveFriendRequest,
            variables: {
                _id
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data.data.removeFriendRequest
    } catch (error) {
        console.log(error)
    }
    return null
}

export async function createFriendRequest(input: FriendRequestType) {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: MutationCreateFriendRequest,
            variables: {
                input
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data.data.createFriendRequest
    } catch (error) {
        console.log(error)
    }
    return null
}