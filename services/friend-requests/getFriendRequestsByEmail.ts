import getFriendRequestsSenderByEmail from "./getFriendRequestsSenderByEmail";

async function getFriendRequestsByEmail(senderEmail: string, recipientEmail: string) {
    const data = await getFriendRequestsSenderByEmail(senderEmail)
    return data.find(d => d.data().recipientEmail === recipientEmail) || null;
}

export default getFriendRequestsByEmail;