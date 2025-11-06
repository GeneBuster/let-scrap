import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    requestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ScrapRequest",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
