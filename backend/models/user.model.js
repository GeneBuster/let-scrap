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
        // Optional but recommended: add a regex for basic email format validation
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },
    password: {
        type: String,
        required: true,
        select: false // Hide password by default
    },
    role: {
        type: String,
        enum: ['user', 'dealer', 'admin'],
        default: 'user'
    },
    phone: {
        type: String,
        unique: true,
        sparse: true // Allow multiple users to have no phone number
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

const User = mongoose.model('User', UserSchema);

export default User;
