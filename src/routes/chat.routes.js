import express from "express";
import Message from "../models/message.model.js";
const router = express.Router();

router.post("/join-chat", (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  // Store the username in a session (if needed)
  req.session.username = username; 

  // Respond with success
  res.status(200).json({ message: "User joined successfully" });
});

router.get("/chat", async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
        res.render("chat", { username: req.query.username, messages });
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.render("chat", { username: req.query.username, messages: [] });
    }
});

export default router;
