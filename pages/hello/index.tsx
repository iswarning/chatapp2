import { useEffect } from "react";
import { io } from "socket.io-client";

export default function Hello() {
    useEffect(() => {
            
    },[]);

    const click = () => {
        const socket = io("http://localhost:2000")
        socket.emit("message", "Hello world");
    }

    return (
        <div><button type="button" onClick={click}>CLick</button></div>
    )
}