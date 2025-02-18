import express from "express";
import http from "http";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { init } from "./config/socket.js";

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

init(server);