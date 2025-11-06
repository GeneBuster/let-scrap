import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * This is Socket.io middleware, not Express middleware.
 * It runs once per connecting client to authorize the connection.
 *
 * It checks for a token in `socket.handshake.auth.token`.
 */
export const socketAuthMiddleware = (socket, next) => {
  // The token is expected to be sent in the `auth` object on connection
  // from the client
  const token = socket.handshake.auth.token;

  if (!token) {
    // This `next` call with an Error rejects the connection
    return next(new Error('Authentication error: No token provided.'));
  }

  try {
    // Verify the token using the same secret as your Express app
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user payload to the socket object
    // This makes it available in all event listeners (e.g., socket.on('...'))
    // for this specific, connected socket.
    socket.user = decoded;

    // Call next() without an error to allow the connection
    next();
  } catch (error) {
    // If verification fails (bad token, expired, etc.), reject the connection
    return next(new Error('Authentication error: Invalid token.'));
  }
};


// --- HOW TO USE THIS FILE ---

/*
// In your main server file (e.g., index.js or server.js)
// where you initialize Socket.io

import { Server } from 'socket.io';
import http from 'http';
import { socketAuthMiddleware } from './socket.auth.middleware.js'; // Import this file

// ... (your other setup, like Express app)
// const app = express();
// const server = http.createServer(app);

const io = new Server(server, {
  // ... any other socket.io options
});

// === ATTACH THE MIDDLEWARE TO SOCKET.IO ===
// This line tells Socket.io to use your middleware
// for EVERY incoming connection.
io.use(socketAuthMiddleware);

io.on('connection', (socket) => {
  // If the code reaches here, the client was authenticated successfully.
  // The `socket.user` property is now available!

  console.log(`A user connected: ${socket.user.id} (Username: ${socket.user.username})`);

  // You can now use socket.user in any event listener for this client
  socket.on('send_message', (data) => {
    // 'socket.user' contains the user data (id, username) from the JWT
    console.log(`Received message from ${socket.user.username}:`, data.message);
    // ... logic to save message to database...
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.user.username}`);
  });
});
*/


// --- HOW THE CLIENT SHOULD CONNECT ---

/*
// On your client-side (e.g., React, Vue, or plain JS)

import { io } from 'socket.io-client';

// Get the token you stored after login (e.g., from localStorage)
const jwtToken = localStorage.getItem('jwtToken');

const socket = io('http://your-server-url.com', {
  // Send the token in the `auth` object
  // This is where `socket.handshake.auth.token` gets its value from
  auth: {
    token: jwtToken
  }
});

// Optional: Listen for connection errors
socket.on('connect_error', (err) => {
  // This will catch the errors from your middleware
  console.log(err.message); // e.g., "Authentication error: Invalid token."
  // You might want to log the user out or redirect to login here
});

socket.on('connect', () => {
  console.log('Successfully connected and authenticated!');
});
*/

