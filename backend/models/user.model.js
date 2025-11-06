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
        select: false // Keep password hidden by default
    },
    role: {
        type: String,
        enum: ['user', 'dealer', 'admin'],
        default: 'user'
    },
    phone: {
        type: String,
        // Removed unique: true as phone numbers might not be strictly unique depending on requirements
        // sparse: true // Only index documents that have this field
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String // Added country based on previous schema
    },
    // Dealer-specific fields
    averageRating: {
        type: Number,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    // --- New Field for Avatar Selection ---
    avatarSeed: {
        type: String,
        default: 'email' // Default to using email if not set
    }
    // ------------------------------------
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Create index on email for faster lookups
UserSchema.index({ email: 1 });

const User = mongoose.model('User', UserSchema);

export default User;
