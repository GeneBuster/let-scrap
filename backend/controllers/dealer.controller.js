import mongoose from 'mongoose';
import User from "../models/user.model.js";
// 1. Import the ScrapRequest model to perform calculations on it.
import ScrapRequest from '../models/request.model.js';

// Get Dealer Profile (no changes here)
export const getDealerProfile = async (req, res) => {
  try {
    const dealer = await User.findById(req.user.userId).select("-password");
    if (!dealer || dealer.role !== 'dealer') {
      return res.status(404).json({ message: "Dealer not found" });
    }
    res.status(200).json({
      _id: dealer._id,
      name: dealer.name,
      email: dealer.email,
      phone: dealer.phone,
      address: dealer.address,
      status: dealer.status,
      createdAt: dealer.createdAt,
      role: dealer.role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Dealer Profile (no changes here)
export const updateDealerProfile = async (req, res) => {
  try {
    const dealer = await User.findById(req.user.userId);
    if (!dealer || dealer.role !== 'dealer') {
      return res.status(404).json({ message: "Dealer not found" });
    }
    const { name, email } = req.body;
    if (name) dealer.name = name;
    if (email) dealer.email = email;
    await dealer.save();
    res.status(200).json({ message: "Profile updated successfully", dealer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. New function to calculate and return dealer performance statistics.
export const getDealerStats = async (req, res) => {
    try {
        const dealerId = new mongoose.Types.ObjectId(req.user.userId);

        // This powerful query uses the MongoDB Aggregation Framework to process data.
        const stats = await ScrapRequest.aggregate([
            // Stage 1: Find all requests that match the dealer and have been completed.
            {
                $match: {
                    dealer: dealerId,
                    status: 'Completed' // Assumes you have a 'Completed' status
                }
            },
            // Stage 2: Group all matching documents to calculate the sums.
            {
                $group: {
                    _id: null, // Group all results into a single output document
                    totalEarnings: { $sum: '$earnings' }, // Sum the 'earnings' field
                    totalWeight: { $sum: { $sum: '$items.weight' } }, // Sum the weights from the nested items array
                    totalPickups: { $sum: 1 } // Count the number of documents
                }
            }
        ]);

        // If the dealer has no completed requests, the result will be empty.
        // In that case, we return a default object with zero values.
        res.status(200).json(stats[0] || { totalEarnings: 0, totalWeight: 0, totalPickups: 0 });
    } catch (error) {
        console.error("Error fetching dealer stats:", error);
        res.status(500).json({ message: 'Server error while fetching stats.' });
    }
};
