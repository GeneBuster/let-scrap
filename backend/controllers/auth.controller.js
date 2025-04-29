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
    const { name, email, password, phone} = req.body;
    console.log("Request Body: ", req.body);

    if (!phone) {
      return res.status(400).json({ message: 'Phone number is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, phone});

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: error.message });
  }
};

// Register Dealer
export const registerDealer = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    console.log("Register Dealer Body:", req.body);  // Always log inputs

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingDealer = await Dealer.findOne({ email });
    if (existingDealer) {
      return res.status(400).json({ message: "Dealer already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newDealer = new Dealer({
      name,
      email,
      password: hashedPassword,
      phone
      // address will remain empty unless you fill it later
    });

    await newDealer.save();

    res.status(201).json({ message: "Dealer registered successfully!" });
  } catch (error) {
    console.error("Error during dealer registration:", error);
    res.status(500).json({ error: error.message });
  }
};

// Login (Detects if email exists in User or Dealer collection)
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Try finding User
    let user = await User.findOne({ email });
    let role = 'user';

    // If not found in User, try Dealer
    if (!user) {
      user = await Dealer.findOne({ email });
      role = 'dealer';
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id, role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ 
        message: 'Login successful',
        token,
        role,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
     }); // 🔥 Send role too
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




