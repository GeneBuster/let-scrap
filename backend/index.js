import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import scrapRequestRoutes from "./routes/scrapRequest.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import dealerRoutes from "./routes/dealer.routes.js";
import billRoutes from './routes/bill.routes.js';
import cors from 'cors';


dotenv.config();
const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());


connectDB();

// Define API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dealers", dealerRoutes);
app.use("/api/scrap-requests", scrapRequestRoutes);
app.use('/api/bills', billRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
