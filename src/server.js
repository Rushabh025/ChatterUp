import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import app from './app.js';
import connectDB from './config/db.js';
import socketHandler from './config/socket.js';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server);

// Configure Socket.io events
socketHandler(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
