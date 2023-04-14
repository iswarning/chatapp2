import getUserByEmail from "@/services/users/getUserByEmail";

export const getRecipientUserName = (recipientEmail: string) => {
    let result;
    getUserByEmail(recipientEmail).then((user) => {
        result = user?.data()?.fullName || recipientEmail;
    })
    return result;
}