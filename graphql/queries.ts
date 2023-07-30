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
          _id
          senderId
          recipientId
          createdAt
        }
        listFriendRequest {
          _id
          senderId
          recipientId
          createdAt
        }
        listChatRoom {
          _id
          members
          photoURL
          name
          admin
          isGroup
          createdAt
          updatedAt
        }
      }
    }
`

export const QueryGetUserInfoById = `
    query($_id: String!){
      user(_id: $_id){
        _id
        fullName
        email
        photoURL
        phoneNumber
        fcmToken
        createdAt
        updatedAt
      }
    }
`

export const QueryGetAllMessagesByChatRoomId = `
    query($chatRoomId: String!){
      getAllMessagesByChatRoomId(chatRoomId: $chatRoomId){
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

export const QueryPaginate = `
    query($input: PaginateInput!){
      paginateMessage(paginateInput: $input){
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

export const QueryGenerateRtcToken = `
  query($input: GenerateRtcTokenInput!){
    generateRtcToken(generateRtcTokenInput: $input)
  }
`

export const QueryGetLastMessage = `
    query($chatRoomId: String!){
      getLastMessage(chatRoomId: $chatRoomId){
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


export const QueryGetFileByKey = `
    query($key: String!){
      getFileByKey(key: $key){
        _id
        message
        type
        senderId
        seen
        chatRoomId
        createdAt
        updatedAt
      }
    }
`

export const QueryFindUserSuggestion = `
    query($userId: String!){
      findUserSuggestion(userId: $userId){
        _id
        fullName
        email
        photoURL
        phoneNumber
        fcmToken
        createdAt
        updatedAt
      }
    }
`

export const QueryFindAllUser = `
    query{
      users{
        _id
        fullName
        email
        photoURL
        phoneNumber
        fcmToken
        createdAt
        updatedAt
      }
    }
`