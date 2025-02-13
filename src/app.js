import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import chatRoutes from './routes/chat.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// Set __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Set up view engine (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Register API routes
app.use('/api/chat', chatRoutes);
app.use('/api/user', userRoutes);

// Render the welcome page for onboarding
app.get('/', (req, res) => {
  res.render('welcome');
});

// Render the chat room (optionally preload chat history)
app.get('/chat', (req, res) => {
  const username = 'SomeUser'; // Or get from session/local storage
  res.render('chat', { username, messages: [] });
});


export default app;
