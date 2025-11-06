import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../context/SocketContext'; // Get the shared socket

/**
 * SDE: This is a "Controller" hook.
 * It manages all the event logic for a SINGLE chat room,
 * and it is built to match the "Socket.io Event Handler (v2)" API contract.
 *
 * @param {string} roomId The ID of the room to join (e.g., the scrapRequestId)
 */
export const useChat = (roomId) => {
  const { socket } = useSocket(); // Get the single, shared socket instance
  const [messages, setMessages] = useState([]); // Start with an empty array

  // === 1. SDE FIX: HISTORY HYDRATION ===
  // Memoize the handler to receive the history *pushed* from the server.
  const handleReceiveHistory = useCallback((history) => {
    console.log('[useChat] Received chat history.');
    setMessages(history); // Set the messages from the server's welcome packet
  }, []);

  // === 2. SDE FIX: INCOMING MESSAGE ===
  // Memoize the handler for *new* messages
  const handleReceiveMessage = useCallback((newMessage) => {
    // SDE: Use functional update to avoid stale state
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  // Effect for joining room and setting up listeners
  useEffect(() => {
    if (!socket || !roomId) return; // Wait for socket and a valid room

    // --- SDE FIX: "JOIN ROOM" API CONTRACT ---
    // 1. Join the specific chat room using the *correct* event name
    console.log(`[useChat] Emitting 'join_request_room': ${roomId}`);
    socket.emit('join_request_room', roomId);
    // ----------------------------------------

    // --- SDE FIX: "CHAT HISTORY" API CONTRACT ---
    // 2. Set up the listener for the *chat_history* event
    socket.on('chat_history', handleReceiveHistory);
    // -----------------------------------------

    // 3. Set up the listener for new messages
    socket.on('receive_message', handleReceiveMessage);

    // 4. Set up the listener for errors in *this* room
    socket.on('error', (errorMessage) => {
      console.error(`[useChat] Error in room ${roomId}:`, errorMessage);
    });

    // 5. Cleanup function: Leave the room and remove listeners
    return () => {
      console.log(`[useChat] Leaving room: ${roomId}`);
      // SDE: We don't have a "leave_room" handler on the server,
      // but disconnect is handled automatically. We *must* remove listeners.
      socket.off('chat_history', handleReceiveHistory);
      socket.off('receive_message', handleReceiveMessage);
      socket.off('error');
    };
  // SDE: `handleReceiveHistory` is added as a dependency
  }, [socket, roomId, handleReceiveMessage, handleReceiveHistory]);

  // Function to send a message
  const sendMessage = (messageText) => {
    if (!socket || !messageText.trim()) return;

    // === 3. SDE FIX: "SEND MESSAGE" API CONTRACT ===
    // The backend `socket.handler.js` is listening for this
    socket.emit('send_message', {
      scrapRequestId: roomId, // The contract expects `scrapRequestId`
      message: messageText,
    });
    // ----------------------------------------
  };

  return { messages, sendMessage };
};

