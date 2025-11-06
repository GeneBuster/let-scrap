import mongoose from 'mongoose';
const { Schema } = mongoose;

// --- New Sub-Schema for Chat Messages ---
const MessageSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Links to the User who sent the message
        required: true
    },
    senderName: { // Denormalize sender's name for easy display
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true // Adds createdAt for each message
});
// ----------------------------------------

const ScrapRequestSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dealer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    items: [{
        itemType: { type: String, required: true },
        weight: { type: Number, required: true }
    }],
    pickupAddress: {
        street: { type: String, required: true },
        city: { type: String },
        state: { type: String },
        zip: { type: String }
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Picked Up', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    earnings: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null
    },
    review: {
        type: String,
        trim: true,
        default: null
    },
    // --- New Field for Chat History ---
    chatHistory: [MessageSchema]
    // ------------------------------------
}, {
    timestamps: true
});

const ScrapRequest = mongoose.model('ScrapRequest', ScrapRequestSchema);
export default ScrapRequest;
