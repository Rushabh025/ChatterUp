export default (io) => {
  io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);
    
    // Listen for a join event from the client
    socket.on('join', (userData) => {
      socket.username = userData.name;
      socket.broadcast.emit('userJoined', { name: socket.username });
    });
    
    // Listen for chat messages
    socket.on('chatMessage', (msg) => {
      const messageData = {
        sender: socket.username,
        content: msg,
        timestamp: new Date()
      };
      io.emit('chatMessage', messageData);
    });
    
    // Listen for typing events
    socket.on('typing', () => {
      socket.broadcast.emit('typing', { name: socket.username });
    });
    
    // Listen for stop typing events
    socket.on('stopTyping', () => {
      socket.broadcast.emit('stopTyping', { name: socket.username });
    });
    
    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      io.emit('userLeft', { name: socket.username });
    });
  });
};
