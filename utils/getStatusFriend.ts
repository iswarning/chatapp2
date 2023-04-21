import getFriendRequestsByEmail from "@/services/friend-requests/getFriendRequestsByEmail";
import getFriendRequestsRecipientByEmail from "@/services/friend-requests/getFriendRequestsRecipientByEmail";
import getFriendByEmails from "@/services/friends/getFriendByEmails";

export default async function getStatusFriend(emailLoggedIn: string, emailIsFriend: string) {

    let status = 'isStranger';

    const friendRequestsByEmail = await getFriendRequestsByEmail(emailLoggedIn, emailIsFriend);
        
    if(friendRequestsByEmail?.exists
        && friendRequestsByEmail?.data().senderEmail === emailLoggedIn) {

        status = 'isFriendRequest';
    }

    const friendRequestsRecipientByEmail = await getFriendRequestsRecipientByEmail(emailLoggedIn);

    if(friendRequestsRecipientByEmail.length > 0) {
        const findFriend = friendRequestsRecipientByEmail.find((item) => 
            item.data().senderEmail === emailIsFriend);

        if(findFriend?.exists) {
            status = 'isPendingAccept';
        }
    }

    const friendByEmails = await getFriendByEmails(emailLoggedIn, String(emailIsFriend));

    if(friendByEmails?.exists) {
        status = 'isFriend';
    }

    return status;
    
}