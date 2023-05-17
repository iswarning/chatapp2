import { io } from "socket.io-client";

export default function getNotificationMessage(userLoggedIn: any) {
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
      socket.on("message", msg => {
        new Notification("New Message");
        // const data = JSON.parse(msg);
        // if(data.recipient.includes(userLoggedIn?.email)) {
        //     const options: any = {
        //       body: data.sender + ": " + data.message,
        //       icon: "https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        //       dir: "ltr"
        //     };
        //   new Notification("New Message", options);
        // }
    });
}