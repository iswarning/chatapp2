export default function getResponseCall(socketRef: any, user: any, isOpen : boolean, onOpen: any) {
    socketRef.current.on("response-call-video", (res: string) => {
        let data = JSON.parse(res);
        if(data.recipient.includes(user?.email)) {
            if(!isOpen) {
                onOpen();
            }
            return {
                chatRoomId: data.chatId,
                sender: data.sender,
                recipient: data.recipient,
                isGroup: data.isGroup,
            }
        }
    });

    return null;
}