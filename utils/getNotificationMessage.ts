import { toast } from "react-toastify";
import { io } from "socket.io-client";

export default function getNotificationMessage(userLoggedIn: any) {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!,{
      path: process.env.NEXT_PUBLIC_SOCKET_IO_PATH
    });
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
      socket.disconnect();
    };
}