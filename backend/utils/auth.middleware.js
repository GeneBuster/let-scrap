import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js"; // ✅ Import User model

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch full user from DB
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user; // ✅ attach full user object
    next();
    
  } catch (error) {
    return res.status(400).json({ message: "Invalid token" });
  }
};
