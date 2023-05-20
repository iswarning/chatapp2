import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "../types/next";
import { Server as ServerIO } from "socket.io";
import { Server as NetServer } from "http";
import { PeerServer } from "peer";
import EventEmitter from "events";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {

    const httpServer: NetServer = res.socket.server as any;

    const io = new ServerIO(httpServer, {
      path: "/api/socketio",
      cors: {
        origin: "*"
      }
    });

    PeerServer({
        path: "/api/socketio",
        port: 443
    })

    io.on("connection", socket => {

        socket.on("send-message", (msg) => {
            io.emit("response-message", msg);
        })

        socket.on('call-video', (senderCall, recipientCall, chatId) => {
            io.emit("response-call", senderCall, recipientCall, chatId)
        });

        socket.on('reject-call', (recipientCall, recipientName, statusCall, chatId) => {
            io.emit("response-reject", recipientCall, recipientName, statusCall, chatId)
        });
    
        socket.on('join-room', (roomId, userId, recipientId) => {
            socket.join(roomId)
            socket.to(roomId).emit('user-connected', userId)
            socket.on('disconnect', () => {
                socket.to(roomId).emit('user-disconnected', userId)
            })
        })
    })

    res.socket.server.io = io;
  }

  EventEmitter.setMaxListeners(100);
  
  res.end();
};
