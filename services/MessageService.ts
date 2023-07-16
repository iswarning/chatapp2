import { MutationCreateMessage } from "@/graphql/mutations"
import { QueryGetAllMessagesByChatRoomId, QueryGetLastMessage } from "@/graphql/queries"
import { MessageType } from "@/types/MessageType"
import axios from "axios"

export async function getAllMessagesByChatRoomId(chatRoomId: string) {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: QueryGetAllMessagesByChatRoomId,
            variables: {
                chatRoomId
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data.data.getAllMessagesByChatRoomId
    } catch (error) {
        console.log(error)
    }
    return null
}

export async function getLastMessage(chatRoomId: string) {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: QueryGetLastMessage,
            variables: {
                chatRoomId
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data.data.getLastMessage
    } catch (error) {
        console.log(error)
    }
    return null
}

export async function createMessage(input: MessageType) {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: MutationCreateMessage,
            variables: {
                input
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data.data.createMessage
    } catch (error) {
        console.log(error)
    }
    return null
}
