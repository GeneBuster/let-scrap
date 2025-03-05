const mongoose = require('mongoose');

const DealerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    status: {
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    acceptedRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ScrapRequest'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Dealer = mongoose.model('Dealer', DealerSchema);

export default Dealer
