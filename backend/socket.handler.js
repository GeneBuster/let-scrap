import ScrapRequest from './models/request.model.js';
import mongoose from 'mongoose';

export const initializeSocketIO = (io) => {
  io.on('connection', (socket) => {
    const userId = socket.user?.id || socket.user?.userId;
    if (!userId) {
      console.error("Socket connected but no user ID found. Auth middleware might be misconfigured.");
      socket.disconnect(true);
      return;
    }

    console.log(`Socket connected: User ${userId} (Socket ID: ${socket.id})`);

    // === JOIN ROOM HANDLER ===
    socket.on('join_request_room', async (scrapRequestId) => {
      try {
        const request = await ScrapRequest.findById(scrapRequestId);
        if (!request) {
          socket.emit('error', 'Request not found.');
          return;
        }

        if (
          request.user.toString() !== userId &&
          request.dealer?.toString() !== userId
        ) {
          socket.emit('error', 'Unauthorized to join this room.');
          return;
        }

        socket.join(scrapRequestId);
        console.log(`User ${userId} joined room: ${scrapRequestId}`);

        socket.emit('chat_history', request.chatHistory);
      } catch (error) {
        console.error('Error joining room:', error);
        socket.emit('error', 'Server error while joining room.');
      }
    });

    // === SEND MESSAGE HANDLER ===
    socket.on('send_message', async ({ scrapRequestId, message }) => {
      try {
        const senderUserId = socket.user.id || socket.user.userId;
        const senderName = socket.user.name || socket.user.username;

        if (!senderName) {
          console.error('socket.user missing name field.');
          socket.emit('error', 'User identity incomplete.');
          return;
        }

        const newMessage = {
          _id: new mongoose.Types.ObjectId(),
          sender: new mongoose.Types.ObjectId(senderUserId),
          senderName: senderName,
          message: message.trim(),
        };

        const updatedRequest = await ScrapRequest.findByIdAndUpdate(
          scrapRequestId,
          { $push: { chatHistory: newMessage } },
          { new: true, runValidators: true }
        );

        if (!updatedRequest) {
          socket.emit('error', 'Request not found.');
          return;
        }

        const savedMessage = updatedRequest.chatHistory.at(-1);

        io.to(scrapRequestId).emit('receive_message', savedMessage);
        console.log(`Message sent by ${senderUserId} to room ${scrapRequestId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', 'Server error while sending message.');
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: User ${userId} (Socket ID: ${socket.id})`);
    });
  });
};
