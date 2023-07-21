import { MutationCreateMessage } from "@/graphql/mutations"
import { QueryGetAllMessagesByChatRoomId, QueryGetFileByKey, QueryGetLastMessage } from "@/graphql/queries"
import { SubscriptionOnNotify } from "@/graphql/subscriptions"
import { MessageType } from "@/types/MessageType"
import axios from "axios"
import { resolve } from "path"

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

export async function getFileByKey(key: string): Promise<MessageType | null> {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: QueryGetFileByKey,
            variables: {
                key
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data.data.getFileByKey
    } catch (error) {
        console.log(error)
    }
    return null
}