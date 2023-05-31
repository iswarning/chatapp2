import { toast } from "react-toastify";

export default function getNotificationMessage(emailLoggedIn: any, socket: any) {
    socket.on("response-notify", (msg: any) => {
      const data = JSON.parse(msg);
      if(data.type === 'send-message' && data.recipient.includes(emailLoggedIn)) {
          const options: any = {
            body: data.name + ": " + data.message,
          };
          toast(options.body, { hideProgressBar: true, autoClose: 5000, type: 'info' })
        }
    });
    return () => {
      socket.disconnect()
    }
}