export const QueryGetInitialDataOfUser = `
    query ($userId: String!){
      getInitialDataOfUser(userId: $userId){
        userInfo {
          _id
          fullName
          email
          photoURL
          phoneNumber
          fcmToken
          createdAt
          updatedAt
        }
        listFriend {
          senderId
          recipientId
        }
        listFriendRequest {
          senderId
          recipientId
        }
        listChatRoom {
          members
          photoURL
          admin
          isGroup
        }
      }
    }
`

export const MutationCreateUser = `
    mutation()
`