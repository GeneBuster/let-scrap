import mongoose from 'mongoose';
import '../models/user.model.js';
import '../models/dealer.model.js';
const ScrapRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            itemType: { type: String, required: true }, // e.g., plastic, metal, paper
            weight: { type: Number, required: true } // in kg
        }
    ],
    pickupAddress: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    dealer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dealer',
        default: null // Assigned once a dealer accepts the request
    },
    requestedAt: {
        type: Date,
        default: Date.now
    }
});

const request= mongoose.model('ScrapRequest', ScrapRequestSchema);
export default request