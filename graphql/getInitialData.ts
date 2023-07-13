import { gql, useQuery } from "@apollo/client"

const queryUserInfo = gql`
    query($_id: String!){
        user(_id: $_id){
            fullName
            email
            photoURL
            phoneNumber
        }
    }
`

const queryListFriend = gql`
    query($userId: String!){
        getListFriendOfUser(userId: $userId){
            senderId
            recipientId
        }
    }
`

const queryListFriendRequest = gql`
    query($recipientId: String!){
        getFriendRequestByRecipientId(recipientId: $recipientId){
            senderId
            recipientId
        }
    }
`

const queryListChatRoom = gql`
    query($_id: String!){
        getListChatRoomOfUser(_id: $_id){
            members
            photoURL
            isGroup
            name
            admin
        }
    }
`

const getUserInfo = () => {
    const { loading, error, data } = useQuery(queryUserInfo)

    if (loading) return 'Loading';
    
    if(error) return `Error ${error.message}`;

    return data
}

const getListFriend = () => {
    const { loading, error, data } = useQuery(queryListFriend)

    if (loading) return 'Loading';
    
    if(error) return `Error ${error.message}`;

    return data
}

const getListFriendRequest = () => {
    const { loading, error, data } = useQuery(queryListFriendRequest)

    if (loading) return 'Loading';
    
    if(error) return `Error ${error.message}`;

    return data
}

const getListChatRoom = () => {
    const { loading, error, data } = useQuery(queryListChatRoom)

    if (loading) return 'Loading';
    
    if(error) return `Error ${error.message}`;

    return data
}

export default function getInitialData() {
    return {
        userInfo: getUserInfo(),
        listFriend: getListFriend(),
        listFriendRequest: getListFriendRequest(),
        listChatRoom: getListChatRoom(),
    }
}