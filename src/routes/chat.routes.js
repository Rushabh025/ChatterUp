import express from 'express';
import { getChatHistory } from '../controllers/chat.controller.js';

const router = express.Router();

// Route to get chat history
router.get('/history', async (req, res) => {
  try {
    const history = await getChatHistory();
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
});

export default router;
