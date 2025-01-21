const { Server } = require("socket.io");

const io = new Server(8082, {
    cors: {
        origin: "http://localhost:3000", // Adjusted for my Next.js port
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join the user to a room for their specific conversation
    socket.on("joinConversation", (conversationId) => {
        socket.join(conversationId); // Add the user to the conversation's room
        console.log(`User joined conversation room: ${conversationId}`);
    });

    socket.on("sendMessage", (message) => {
        console.log("Message received", message)
        io.to(message.conversation.id).emit("receiveMessage", message)
    })

    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
    });
});


console.log("Socket.IO server is running on port 8082");