import {server} from "./app.js"
import connectDB from './config/db.js';

// Connecting db
connectDB();

// Start the server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});