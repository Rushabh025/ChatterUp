import { Server } from "socket.io";
import Message from "../models/message.model.js";

const activeUsers = new Set(); // Store active users

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

        // Listen for user joining
        socket.on("userJoined", (username) => {
            if (username) {
                activeUsers.add(username);
                io.emit("updateActiveUsers", Array.from(activeUsers)); // Send updated list to all clients

                // Notify all users that a new user has joined
                io.emit("userJoinedNotification", `${username} has joined the chat! 🎉`);

                console.log("Active users:", activeUsers);
            }
        });

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
            let leavingUser = null;

            // Remove user from active list
            for (let user of activeUsers) {
                activeUsers.delete(user);
                leavingUser = user;
                break; // Only remove one user per disconnect event
            }

            io.emit("updateActiveUsers", Array.from(activeUsers));

            if (leavingUser) {
                // Notify all users that someone has left
                io.emit("userLeftNotification", `${leavingUser} has left the chat. 😢`);
            }

            console.log("User disconnected:", socket.id);
        });
    });
  

}
