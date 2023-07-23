export const MutationCreateUser = `
    mutation($createUserInput: CreateUserInput!){
        createUser(createUserInput: $createUserInput){
            _id
            fullName
            email
            photoURL
            fcmToken
            phoneNumber
        }
    }
`

export const MutationCreateChatRoom = `
    mutation($input: CreateChatRoomInput!){
        createChatRoom(createChatRoomInput: $input){
            _id
            members
            photoURL
            isGroup
            name
            admin
            createdAt
            updatedAt
        }
    }
`

export const MutationUpdateChatRoom = `
    mutation($input: UpdateChatRoomInput!){
        updateChatRoom(updateChatRoomInput: $input){
            _id
            members
            photoURL
            isGroup
            name
            admin
            createdAt
            updatedAt
        }
    }
`

export const MutationCreateFriend = `
    mutation($input: CreateFriendInput!){
        createFriend(createFriendInput: $input){
            _id
            senderId
            recipientId
            createdAt
        }
    }
`


export const MutationRemoveFriend = `
    mutation($_id: String!){
        removeFriend(_id: $_id){
            _id
            senderId
            recipientId
            createdAt
        }
    }
`

export const MutationRemoveFriendRequest = `
    mutation($_id: String!){
        removeFriendRequest(_id: $_id){
            _id
            senderId
            recipientId
            createdAt
        }
    }
`

export const MutationCreateFriendRequest = `
    mutation($input: CreateFriendRequestInput!){
        createFriendRequest(createFriendRequestInput: $input){
            _id
            senderId
            recipientId
            createdAt
        }
    }
`

export const MutationCreateMessage = `
    mutation($input: CreateMessageInput!){
        createMessage(createMessageInput: $input){
            _id
            message
            type
            senderId
            reaction
            seen
            chatRoomId
            createdAt
            updatedAt
        }
    }
`

export const MutationUpdateMessage = `
    mutation($input: UpdateMessageInput!){
        updateMessage(updateMessageInput: $input){
            _id
            message
            type
            senderId
            reaction
            seen
            chatRoomId
            createdAt
            updatedAt
        }
    }
`