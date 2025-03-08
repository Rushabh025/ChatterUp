import express from "express";
import upload from "../middleware/upload.js";
import User from "../models/user.model.js";

const router = express.Router();

router.post("/join-chat", upload.single("profilePicture"), async (req, res) => {
    try {
        console.log("Received body:", req.body);
        console.log("Received file:", req.file);

        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }

        // Check if user already exists
        let user = await User.findOne({ name: username });
        if (user) {
            console.log("User already exists:", user);
        }else {
            // Assign profile picture (uploaded or default)
            const profilePicture = req.file ? `/uploads/${req.file.filename}` : "/uploads/default-profile.jpg";

            // Create new user
            user = new User({ name: username, profilePicture, online: true });
            await user.save();
            console.log("New user created:", user);
        }

        // Store username in session
        req.session.username = user.name;

        res.status(200).json({ 
            message: "User joined", 
            username: user.name, 
            profilePicture: user.profilePicture 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
