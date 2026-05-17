import mongoose, { Schema } from "mongoose";

const TestimonialSchema = new Schema(
  {
    customerName: { type: String, required: true },
    rating: { type: Number, required: true },
    feedback: { type: String, required: true },
    purchaseLocation: { type: String, required: true },
    purchaseDate: { type: String, required: true },
    photo: { type: String, required: true },
    videoPlaceholder: { type: String, required: true },
  },
  { timestamps: true },
);

export const TestimonialModel =
  mongoose.models.Testimonial ?? mongoose.model("Testimonial", TestimonialSchema);
