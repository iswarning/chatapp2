import { MutationCreateFriend, MutationRemoveFriendRequest } from "@/graphql/mutations"
import { FriendType } from "@/types/FriendType"
import axios from "axios"

export async function createFriend(input: FriendType) {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: MutationCreateFriend,
            variables: {
                input: input
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data.data.createFriend
    } catch (error) {
        console.log(error)
    }
    return null
}