export const chatAlreadyExists = (): boolean => {
    return !!chatSnapshot?.docs.find(
        (chat: any) => chat.data().users.find(
            (email: any) => email === recipientEmail)?.length > 0);
}