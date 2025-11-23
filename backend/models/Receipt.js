import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema(
  {
    fileName: String,
    ocrText: String,
    totalAmount: Number,
    items: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Receipt", receiptSchema);
