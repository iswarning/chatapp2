import { QueryGetInitialDataOfUser } from "@/graphql/queries";
import { UserType } from "@/types/UserType";
import axios from "axios";

export async function getInitialDataOfUser(userId: string) {
    try {
        const data = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: QueryGetInitialDataOfUser,
            variables: {
                userId
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return data
    } catch (error) {
        console.log(error)
    }
    return null
}

export async function createNewUser(input: UserType) {
    try {
        const data = await axios.post(process.env.NEXT_PUBLIC_GRAPHQL_ENPOINT!, {
            query: QueryGetInitialDataOfUser,
            variables: {
                userId
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        return data
    } catch (error) {
        console.log(error)
    }
    return null
}
