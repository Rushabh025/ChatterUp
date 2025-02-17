import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Setup ES6 module dirname (__dirname replacement)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
app.use(cors());

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve the chat page
app.get("/", (req, res) => {
    res.render("chat"); // Renders views/chat.ejs
});

export const server = http.createServer(app);

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
