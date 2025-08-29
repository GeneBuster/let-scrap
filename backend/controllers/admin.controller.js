import User from '../models/user.model.js';

// Controller function to get all users
export const getAllUsers = async (req, res) => {
  try {
    // Use the User model to find all documents in the collection.
    // We explicitly exclude the password field from the results for security.
    const users = await User.find({}).select('-password');
    
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: 'Server error while fetching users.' });
  }
};

// You can add more admin-specific controller functions here later.
// For example:
// export const suspendUser = async (req, res) => { ... };
