import Message from '../models/Message.js';

export const saveMessage = async (data) => {
  try {
    const message = new Message(data);
    await message.save();
    return message;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

export const getChatHistory = async () => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    return messages;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};
