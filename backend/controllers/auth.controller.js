import User from "../models/user.model.js"; // The only model you need now
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in .env file");
}

// A single, unified register function
export const register = async (req, res) => {
  try {
    // 'role' is now expected from the request body (e.g., from a dropdown on the signup form)
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: 'Name, email, password, and phone are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        phone,
        role // The role is saved directly during creation
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });

  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: error.message });
  }
};

// A simplified and more secure login function
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user and explicitly ask for the password, which is hidden by default
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // The user's role is retrieved directly from the user document
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
        message: 'Login successful',
        token,
        role: user.role, // Send the role from the user object
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
     });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};