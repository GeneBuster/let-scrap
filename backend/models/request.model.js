import mongoose from "mongoose";

const scrapRequestSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                itemType: { type: String, required: true },
                weight: { type: Number, required: true },
            },
        ],
        pickupAddress: {
            street: { type: String, required: true },
            city: { type: String },
            state: { type: String },
            zip: { type: String },
        },
        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected", "Completed", "Picked Up"],
            default: "Pending",
        },
        dealer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        timeSlot: {
            type: String,
            default: null,
        },
        pickupDate: {
            type: String,
            default: null,
        },
        earnings: {
            type: Number,
            default: 0
        },
        // --- ADD THESE FIELDS ---
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: {
            type: String,
            trim: true,
            maxlength: 500
        }
    },
    { timestamps: true }
);

export default mongoose.model("ScrapRequest", scrapRequestSchema);
