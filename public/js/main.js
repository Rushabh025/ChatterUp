// main.js
const socket = io();

// Elements
const chatHeaderText = document.getElementById('chat-header-text');
const typingIndicator = document.getElementById('typing-indicator');
const chatMessages = document.getElementById('chat-messages');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const usersList = document.getElementById('users-list');

let typingTimeout;

const username = localStorage.getItem('username') || 'Anonymous';
socket.emit('join', { name: username });

// Listen for new messages
socket.on('chatMessage', (message) => {
  addMessageToUI(message);
});

// Listen for typing events
socket.on('typing', (data) => {
  typingIndicator.innerText = `${data.name} is typing...`;
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    typingIndicator.innerText = '';
  }, 3000);
});

// Listen for user joined
socket.on('userJoined', (data) => {
  const infoMsg = {
    sender: 'System',
    content: `${data.name} joined the chat`,
    timestamp: new Date()
  };
  addMessageToUI(infoMsg);
  updateUserList();
});

// Listen for user left
socket.on('userLeft', (data) => {
  const infoMsg = {
    sender: 'System',
    content: `${data.name} left the chat`,
    timestamp: new Date()
  };
  addMessageToUI(infoMsg);
  updateUserList();
});

// Emit typing when user types
messageInput.addEventListener('input', () => {
  socket.emit('typing');
});

// Handle form submission
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const content = messageInput.value.trim();
  if (!content) return;

  const messageData = {
    sender: username,
    content,
    timestamp: new Date()
  };

  socket.emit('chatMessage', content);  // send to server
  addMessageToUI(messageData);          // add locally
  messageInput.value = '';
});

// Append a new message bubble to the UI
function addMessageToUI(msg) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  const avatarDiv = document.createElement('div');
  avatarDiv.classList.add('avatar');
  const img = document.createElement('img');
  img.src = '/images/default-profile.png'; // or use a dynamic property
  avatarDiv.appendChild(img);

  const bubbleDiv = document.createElement('div');
  bubbleDiv.classList.add('bubble');

  // Bubble header: user + timestamp
  const bubbleHeader = document.createElement('div');
  bubbleHeader.classList.add('bubble-header');

  const userNameSpan = document.createElement('span');
  userNameSpan.classList.add('user-name');
  userNameSpan.innerText = msg.sender;

  const timeSpan = document.createElement('span');
  timeSpan.classList.add('timestamp');
  const date = new Date(msg.timestamp);
  timeSpan.innerText = date.toLocaleTimeString();

  bubbleHeader.appendChild(userNameSpan);
  bubbleHeader.appendChild(timeSpan);

  // Bubble content
  const bubbleContent = document.createElement('div');
  bubbleContent.classList.add('bubble-content');
  bubbleContent.innerText = msg.content;

  bubbleDiv.appendChild(bubbleHeader);
  bubbleDiv.appendChild(bubbleContent);

  messageDiv.appendChild(avatarDiv);
  messageDiv.appendChild(bubbleDiv);

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Fetch online users from server and update the user list
function updateUserList() {
  fetch('/api/user/online')
    .then(res => res.json())
    .then(users => {
      usersList.innerHTML = '';
      users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.name;
        usersList.appendChild(li);
      });
    })
    .catch(err => console.error('Error fetching user list:', err));
}

// Initial user list update
updateUserList();
