import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function Hello() {

    const socketRef: any = useRef();

    useEffect(() => {
        // socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
  
        // socketRef.current.on('message', (msg) => {
        //   console.log(msg)
        // }) // phần này đơn giản để gán id cho mỗi phiên kết nối vào page. Mục đích chính là để phân biệt đoạn nào là của mình đang chat.
  
        // return () => {
        //   socketRef.current.disconnect();
        // }; 
        socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL!);
  
        socketRef.current.on('sendDataServer', data => {
            console.log("sendDataServersendDataServersendDataServer")
        }) // phần này đơn giản để gán id cho mỗi phiên kết nối vào page. Mục đích chính là để phân biệt đoạn nào là của mình đang chat.

        return () => {
            socketRef.current.disconnect();
        };
    },[]);

    return (
        <div><button type="button">CLick</button></div>
    )
}