import { toast } from "react-toastify";

export default function getNotificationAcceptFriend(emailLoggedIn: any, socket: any) {
    socket.on("response-notify", (msg: any) => {
      const data = JSON.parse(msg);
      if(data.type === 'accept-friend' && data.recipient === emailLoggedIn) {
          toast(`${data.name} accepted your friend request `, { hideProgressBar: true, autoClose: 5000, type: 'info' })
        }
    });
    return () => {
      socket.disconnect()
    }
}