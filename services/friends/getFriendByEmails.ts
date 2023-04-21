import getAllFriendOfUser from "./getAllFriendOfUser";

async function getFriendByEmails(email1: string, email2: string) {
    const querySnapshot = await getAllFriendOfUser(email1);
    
    const friend = querySnapshot.find((friend) => 
        friend.data().users.includes(email2)
    );
    return friend || null;
}

export default getFriendByEmails;