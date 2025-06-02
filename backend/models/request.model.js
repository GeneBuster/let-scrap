
import mongoose from "mongoose";

const scrapRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Make sure you have a User model
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
      ref: "Dealer",
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
  },
  { timestamps: true }
);

export default mongoose.model("ScrapRequest", scrapRequestSchema);
