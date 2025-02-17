import dotenv from 'dotenv';
dotenv.config();
import {server} from "./app.js"

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});