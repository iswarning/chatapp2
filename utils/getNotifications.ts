import { io } from "socket.io-client";
import { toast } from "react-toastify";
export default function getNotification(emailLoggedIn: any) {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
    socket.on("response-notify", (msg: any) => {
      const data = JSON.parse(msg);

      if(data.type === 'send-message' && data.recipient.includes(emailLoggedIn)) {
        const options: any = {
          body: data.name + ": " + data.message,
        };
        toast(`${options.body}`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
      }  

      if(data.type === 'accept-friend' && data.recipient === emailLoggedIn) {
        const options: any = {
          body: data.name + " accepted your friend request",
        };
        toast(`${options.body}`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
      }

      if(data.type === 'send-add-friend' && data.recipient === emailLoggedIn) {
        const options: any = {
          body: data.name + " sent you a friend request" 
        };
        toast(`${options.body}`, { hideProgressBar: true, autoClose: 5000, type: 'info' })
      }

    });

    return () => {
      socket.disconnect()
    }
}