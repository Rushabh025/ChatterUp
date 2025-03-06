import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (one level up)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import express from "express";
import http from "http";
import cors from "cors";
import { init } from "./config/socket.js";

export const app = express();
app.use(cors());

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve the chat page
app.get("/", (req, res) => {
    res.render("welcome"); // Renders views/chat.ejs
});

export const server = http.createServer(app);

init(server);