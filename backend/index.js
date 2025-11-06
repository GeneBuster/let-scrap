import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import connectDB from "./database/db.js";
import scrapRequestRoutes from "./routes/scrapRequest.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import dealerRoutes from "./routes/dealer.routes.js";
import billRoutes from "./routes/bill.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import messageRoutes from "./routes/message.routes.js"; // 🆕 new route

import { socketAuthMiddleware } from "./utils/socket.auth.middleware.js";
import Message from "./models/message.model.js"; // 🆕 import model

dotenv.config();

const app = express();
const server = http.createServer(app);

// --- SOCKET.IO INITIALIZATION ---
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://let-scrap-5z4c.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

// --- EXPRESS CONFIG ---
app.use(
  cors({
    origin: ["http://localhost:3000", "https://let-scrap-5z4c.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

// --- CONNECT DATABASE ---
connectDB();

// --- SOCKET MIDDLEWARE (JWT) ---
io.use(socketAuthMiddleware);

// --- SOCKET EVENT HANDLER ---
io.on("connection", (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  // Join a specific scrap request chat room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`[Socket] ${socket.id} joined room ${roomId}`);
  });

  // Handle new messages
  socket.on("sendMessage", async (message) => {
    try {
      // 🧩 Save message in MongoDB
      const savedMessage = await Message.create({
        requestId: message.requestId,
        senderId: message.senderId,
        text: message.text,
      });

      // 📨 Broadcast to everyone in that room (user + dealer)
      io.to(message.requestId).emit("receiveMessage", savedMessage);
      console.log(`[Socket] Message broadcasted to room ${message.requestId}`);
    } catch (err) {
      console.error("[Socket] Failed to save message:", err);
      socket.emit("error", "Message could not be saved.");
    }
  });

  socket.on("disconnect", (reason) => {
    console.log(`[Socket] Disconnected: ${socket.id} (${reason})`);
  });
});

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dealers", dealerRoutes);
app.use("/api/scrap-requests", scrapRequestRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes); // 🆕 route to fetch chat history

// --- TEST ROUTE ---
app.get("/", (req, res) => res.send("API is running..."));

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[Server] Running on port ${PORT}`);
  console.log(`[Sockets] Ready for connections...`);
});

export default app;
