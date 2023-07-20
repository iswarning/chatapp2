export const SubscriptionOnNotify = `
    subscription {
        onSub {
            message
            senderId
            recipientId
            data {
                message {
                    message
                    createdAt
                }
            }
        }
    }
`