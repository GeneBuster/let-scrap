import User from "../models/user.model.js";

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    // We get the userId from the authMiddleware
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) return res.status(404).json({ message: "User not found" });

    // Send the entire user object. It already has the correct role,
    // and the password has been deselected.
    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    // --- BUG FIX ---
    // Changed req.user.id to req.user.userId to match the JWT payload
    const user = await User.findById(req.user.userId);
    // --- END FIX ---

    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, phone, address } = req.body;
    // Update the fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    const updatedUser = await user.save();

    // --- BUG FIX ---
    // The frontend (ProfilePage.jsx) expects the response in the
    // format: { user: ... }
    // We now send the response in that specific format.
    res.status(200).json({ user: updatedUser });
    // --- END FIX ---

  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};
