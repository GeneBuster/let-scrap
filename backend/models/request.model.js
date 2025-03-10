import mongoose from 'mongoose';
import '../models/user.model.js';
import '../models/dealer.model.js';

const ScrapRequestSchema = new mongoose.Schema({
  scrapType: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  pickupAddress: {
    type: String,
    required: true,
  },
  preferredPickupTime: {
    type: Date,
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

const request = mongoose.model('ScrapRequest', ScrapRequestSchema);

export default request;
