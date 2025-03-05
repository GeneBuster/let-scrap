import User from "../models/user.model.js";
import Dealer from "../models/dealer.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in .env file");
}

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password,} = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword,});

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Register Dealer
export const registerDealer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingDealer = await Dealer.findOne({ email });
    if (existingDealer) return res.status(400).json({ message: "Dealer already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newDealer = new Dealer({ name, email, password: hashedPassword });

    await newDealer.save();
    res.status(201).json({ message: "Dealer registered successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login (Detects if email exists in User or Dealer collection)
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    let userType = "user";

    if (!user) {
      user = await Dealer.findOne({ email });
      userType = "dealer";
    }

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, userType }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ message: "Login successful", token, userType });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Middleware: Verify Token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid Token" });
  }
};
