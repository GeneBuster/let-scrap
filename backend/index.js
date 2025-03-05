import express from "express";
import dotenv from "dotenv";
import connectDB from "./database/db.js";
import scrapRequestRoutes from "./routes/scrapRequest.routes.js";
import authRoutes from "./routes/authroutes.js";
import userRoutes from "./routes/user.routes.js";
import dealerRoutes from "./routes/dealer.routes.js";

dotenv.config();
const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
connectDB();

// Define API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dealers", dealerRoutes);
app.use("/api/scrap-requests", scrapRequestRoutes);

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
