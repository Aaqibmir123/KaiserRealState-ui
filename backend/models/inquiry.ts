import mongoose, { Schema } from "mongoose";

const InquirySchema = new Schema(
  {
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    interestedLand: { type: String, required: true },
    message: { type: String, required: true },
    inquiryDate: { type: String, required: true },
    contacted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const InquiryModel = mongoose.models.Inquiry ?? mongoose.model("Inquiry", InquirySchema);
