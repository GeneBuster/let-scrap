import Dealer from "../models/dealer.model.js";

// Get Dealer Profile
export const getDealerProfile = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.user.id).select("-password");
    if (!dealer) return res.status(404).json({ message: "Dealer not found" });

    res.status(200).json({
      _id: dealer._id,
      name: dealer.name,
      email: dealer.email,
      phone: dealer.phone,
      address: dealer.address,
      status: dealer.status,
      createdAt: dealer.createdAt,
      role: "dealer"        // ✅ IMPORTANT: Add role manually
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Dealer Profile
export const updateDealerProfile = async (req, res) => {
  try {
    const dealer = await Dealer.findById(req.user.id);
    if (!dealer) return res.status(404).json({ message: "Dealer not found" });

    const { name, email } = req.body;
    if (name) dealer.name = name;
    if (email) dealer.email = email;

    await dealer.save();
    res.status(200).json({ message: "Profile updated successfully", dealer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
