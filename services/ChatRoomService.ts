import { MutationCreateChatRoom, MutationUpdateChatRoom, MutationVideoCall } from "@/graphql/mutations"
import { ChatType } from "@/types/ChatType"
import { NotifyResponseType } from "@/types/NotifyResponseType"
import axios from "axios"

export async function createChatRoom(input: ChatType) {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: MutationCreateChatRoom,
            variables: {
                input: input
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data.data.createChatRoom
    } catch (error) {
        console.log(error)
    }
    return null
}

export async function updateChatRoom(input: ChatType) {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: MutationUpdateChatRoom,
            variables: {
                input: input
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data.data.updateChatRoom
    } catch (error) {
        console.log(error)
    }
    return null
}

export async function videoCall(input: any) {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: MutationVideoCall,
            variables: {
                input
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return response.data.data.videoCall
    } catch (error) {
        console.log(error)
    }
    return null
}