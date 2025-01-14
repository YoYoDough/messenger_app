const { Server } = require("socket.io");

const io = new Server(8081, {
    cors: {
        origin: "http://localhost:3000", // Adjusted for my Next.js port
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });

    socket.on("sendMessage", (data) => {
        console.log("Message received", data)

        io.emit("receiveMessage", data)
    })
});


console.log("Socket.IO server is running on port 8081");