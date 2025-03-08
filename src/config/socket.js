import { Server } from "socket.io";
import Message from "../models/message.model.js";

const activeUsers = new Set(); // Store active users
const socketUserMap = new Map(); // Map socket.id to username
const typingUsers = new Set(); // Track users who are typing

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
                socketUserMap.set(socket.id, username); // Store the username with the socket ID

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

        // When a user starts typing
        socket.on('typing', () => {
            // socket.broadcast.emit('userTyping', data.username);
            const username = socketUserMap.get(socket.id);
            console.log(`${username} started typing`); // ✅ Debugging log
            if (username) {
                typingUsers.add(username);
                io.emit("userTyping", Array.from(typingUsers)); // Send all users who are typing
                console.log("Active users:", typingUsers);
            }
        });

        // When a user stops typing
        socket.on('stopTyping', () => {
            // socket.broadcast.emit('userStoppedTyping');
            const username = socketUserMap.get(socket.id);
            console.log(`${username} stopped typing`); // ✅ Debugging log
            if (username) {
                typingUsers.delete(username);
                io.emit("userTyping", Array.from(typingUsers)); // Update list
            }
        });
        
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
            const username = socketUserMap.get(socket.id);

            // Remove user from active list
            if (username) {
                activeUsers.delete(username); // Remove user from active users
                socketUserMap.delete(socket.id); // Remove mapping
                typingUsers.delete(username); // Remove from typing users as well

                io.emit("updateActiveUsers", Array.from(activeUsers)); // Update active users list
                io.emit("userTyping", Array.from(typingUsers)); // Update typing indicator
                io.emit("userLeftNotification", `${username} has left the chat. 😢`);
            }
        });
    });
  

}
