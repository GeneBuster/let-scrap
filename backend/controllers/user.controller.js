import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// ✅ Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    // req.user is already a full user object (from auth.middleware)
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error getting user profile:", error);
    res.status(500).json({
      message: "Server error getting profile",
      error: error.message,
    });
  }
};

// ✅ Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, phone, address, avatarSeed } = req.body;

    // Safely update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (avatarSeed) user.avatarSeed = avatarSeed;

    // Optional: allow email updates only if not taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: "Email already in use" });
      user.email = email;
    }

    if (address && typeof address === "object") {
      user.address = {
        street: address.street ?? user.address?.street,
        city: address.city ?? user.address?.city,
        state: address.state ?? user.address?.state,
        zip: address.zip ?? user.address?.zip,
        country: address.country ?? user.address?.country,
      };
    }

    const updatedUser = await user.save();
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.status(200).json({ user: userResponse });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({
      message: "Server error updating profile",
      error: err.message,
    });
  }
};

// ✅ Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password." });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the current one.",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({
      message: "Server error during password change",
      error: err.message,
    });
  }
};
