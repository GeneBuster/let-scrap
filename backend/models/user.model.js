import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'dealer', 'admin'],
        default: 'user'
    },
    phone: {
        type: String,
        unique: true,
        sparse: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    // --- ADDED FOR RATINGS ---
    // These fields will only be used when the role is 'dealer'.
    averageRating: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', UserSchema);

export default User;
