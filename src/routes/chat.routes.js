import express from "express";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

const router = express.Router();

router.get("/chat", async (req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });

        const { username } = req.query;
        console.log("username : ", username);

        // Fetch user from DB
        const user = await User.findOne({ name: username });
        console.log("user : ", user);

        res.render("chat", {
          username: user.name,
          profilePicture: user.profilePicture, 
          messages
        });
    } catch (err) {
        console.error("Error fetching messages:", err);
        res.render("chat", { username: user.name, profilePicture: user.profilePicture, messages: [] });
    }
});

export default router;
