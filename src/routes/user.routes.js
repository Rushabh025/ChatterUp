import express from 'express';
import { registerUser, getOnlineUsers } from '../controllers/user.controller.js';

const router = express.Router();

// Endpoint for user onboarding/registration
router.post('/register', async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Endpoint to get online users
router.get('/online', async (req, res) => {
  try {
    const users = await getOnlineUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve online users' });
  }
});

export default router;
