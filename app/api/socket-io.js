import { Server } from 'socket.io';

let io;

export default function handler(req, res){
    if (!res.socket.server.io){
        console.log("Initializing socket.io...");

        io = new Server(res.socket.server, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
            }
        })

        io.on("connection" , (socket) => {
            console.log("user connected: ", socket.io)

            socket.on("sendMessage", (data) =>{
                console.log("Message received: ", data);
                socket.broadcast.emit("receiveMessage", data);  //broadcast message
            })

            socket.on("disconnect", () => {
                console.log("User disconnected: ", socket.id)
            })
        })
        res.socket.server.io = io;
    }
    res.end();
}