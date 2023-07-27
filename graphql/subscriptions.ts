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
                chatRoom {
                    _id
                    members
                    photoURL
                    isGroup
                    name
                    admin
                    createdAt
                    updatedAt
                }
                friend {
                    _id
                    senderId
                    recipientId
                    createdAt
                }
                friendRequest {
                    _id
                    senderId
                    recipientId
                    createdAt
                }
            }
        }
    }
`

export const SubscriptionOnCall = gql`
    subscription {
        onCall {
            message
            senderId
            recipientId
            type
            dataVideoCall {
                fullName
                photoURL
                chatRoomId
                isGroup
                accessToken
            }
        }
    }
`