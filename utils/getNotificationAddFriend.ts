import { toast } from "react-toastify";

export default function getNotificationAddFriend(emailLoggedIn: any, socket: any) {
    socket.on("response-notify", (msg: any) => {
      const data = JSON.parse(msg);
      if(data.type === 'send-add-friend' && data.recipient === emailLoggedIn) {
          toast(`${data.name} sent you a friend request `, { hideProgressBar: true, autoClose: 5000, type: 'info' })
        }
    });
    return () => {
      socket.disconnect()
    }
}