import mongoose, { Schema } from "mongoose";

const SoldSchema = new Schema(
  {
    buyerName: { type: String, required: true },
    saleDate: { type: String, required: true },
    salePrice: { type: String, required: true },
    contactPhone: { type: String, required: true },
    location: { type: String, required: true },
    areaSize: { type: String, required: true },
    image: { type: String, required: true },
    notes: { type: String, required: true },
  },
  { timestamps: true },
);

export const SoldModel = mongoose.models.Sold ?? mongoose.model("Sold", SoldSchema);
