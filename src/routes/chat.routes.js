import express from "express";
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

router.get("/chat", (req, res) => {
  const username = req.query.username || req.session.username; 

  if (!username) {
    return res.redirect("/");
  }

  res.render("chat", { username });
});

export default router;
