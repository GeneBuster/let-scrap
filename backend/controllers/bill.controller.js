
import Bill from '../models/bill.model.js';
import User from '../models/user.model.js';  


export const generateBill = async (req, res) => {
  try {
    const { userId, items, quantity, price } = req.body;

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const subtotal = items.reduce((total, item) => {
        const itemTotal = item.quantity * item.price;  
        return total + itemTotal;  
      }, 0);


    const newBill = new Bill({
      user: user._id,
      items: items,
      subtotal: subtotal,
      totalAmount: subtotal,
    });

    // Save the bill to the database
    await newBill.save();

    res.status(201).json({ message: 'Bill generated successfully', bill: newBill });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating bill' });
  }

    console.log('User ID:', userId);
    console.log('Items:', items);

};
