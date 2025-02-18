import { Server } from "socket.io";

export const init = (server) =>{

    const io = new Server(server,{
        cors:{
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Socket.io connection event
    io.on("connection", (socket) => {
        console.log("A user connected");
    
        // Listen for messages from the client
        socket.on("chat message", (msg) => {
        console.log("Message received:", msg);
        io.emit("chat message", msg); // Broadcast to all clients
        });
    
        // Handle user disconnect
        socket.on("disconnect", () => {
        console.log("A user disconnected");
        });
    });
  

}
