import { toast } from "react-toastify";
import { io } from "socket.io-client";

export default function getNotificationMessage(userLoggedIn: any, socket: any) {
    socket.on("response-message", (msg: any) => {
      const data = JSON.parse(msg);
      if(data.recipient.includes(userLoggedIn?.email)) {
          const options: any = {
            body: data.name + ": " + data.message,
          };
          toast(options.body, { hideProgressBar: true, autoClose: 5000, type: 'info' })
        }
    });
    return () => {
      socket.current.disconnect()
    }
}