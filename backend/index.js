import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import scrapRequestRoutes from "./routes/scrapRequest.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import dealerRoutes from "./routes/dealer.routes.js";
import billRoutes from './routes/bill.routes.js';
import adminRoutes from './routes/admin.routes.js';
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors({
    // UPDATED: Added the production frontend URL to the list of allowed origins.
    origin: ['http://localhost:3000', 'https://let-scrap-frontend.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

connectDB();

// --- Define API routes ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dealers", dealerRoutes);
app.use("/api/scrap-requests", scrapRequestRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/admin', adminRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

// The app.listen() block has been removed, and the app is now exported.
// This is the required change for Vercel.
export default app;