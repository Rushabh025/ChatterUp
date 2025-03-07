import { Server } from "socket.io";
import Message from "../models/message.model.js";

export const init = (server) =>{

    const io = new Server(server,{
        cors:{
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    // Socket.io connection event
    io.on("connection", async (socket) => {

        console.log("User connected:", socket.id);

        // Load previous messages from MongoDB and send to newly connected user
        try {
            const messages = await Message.find().sort({ timestamp: 1 });
            socket.emit("loadMessages", messages);
        } catch (err) {
            console.error("Error loading messages:", err);
        }
    
        // Listen for messages from the client
        socket.on("chatMessage", async ({ sender, content }) => {
            if (!sender || !content) {
                console.error("Message validation failed: sender and content are required.");
                return;
            }

            try {
                // Save message to MongoDB
                const newMessage = new Message({ sender, content });
                await newMessage.save();

                console.log("Message saved:", newMessage);

                // Broadcast the message to all connected clients
                io.emit("message", newMessage);
            } catch (err) {
                console.error("Error saving message:", err);
            }
        });
    
        // Handle user disconnect
        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
  

}
