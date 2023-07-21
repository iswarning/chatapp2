import { gql } from "@apollo/client";

export const SubscriptionOnNotify = gql`
    subscription {
        onSub {
            message
            senderId
            recipientId
            type
            dataNotify {
                message {
                    _id
                    message
                    type
                    senderId
                    file
                    images
                    seen
                    chatRoomId
                    createdAt
                    updatedAt
                }
            }
        }
    }
`