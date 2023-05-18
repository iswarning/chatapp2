import { toast } from "react-toastify";
import { io } from "socket.io-client";

export default function getNotificationMessage(userLoggedIn: any, socketRef: any) {
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
    socketRef.current.on("responseMessage", (msg: any) => {
      const data = JSON.parse(msg);
      if(data.recipient.includes(userLoggedIn?.email)) {
          const options: any = {
            body: data.name + ": " + data.message,
          };
          toast(options.body, { hideProgressBar: true, autoClose: 5000, type: 'info' })
        }
    });
    return () => {
      socketRef.current.disconnect();
    };
}