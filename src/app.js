import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express from "express";
import session from "express-session";
import http from "http";
import cors from "cors";
import { init } from "./config/socket.js";
import chatRoutes from './routes/chat.routes.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use(session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
}));

// set view engine to render ejs files
app.set('view engine', 'ejs');
app.set('views', path.join(path.resolve(), 'src', 'views'));

app.use(express.static("public"));
app.use(chatRoutes);
  
// Serve the chat page
app.get("/", (req, res) => {
    res.render("welcome"); // Renders views/chat.ejs
});

export const server = http.createServer(app);

init(server);