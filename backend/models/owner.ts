import mongoose, { Schema } from "mongoose";

const OwnerSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    experience: { type: String, required: true },
    bio: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    email: { type: String, required: true },
    officeAddress: { type: String, required: true },
    trustBadges: { type: [String], default: [] },
    socialLinks: {
      type: [
        {
          label: { type: String, required: true },
          href: { type: String, required: true },
        },
      ],
      default: [],
    },
    photo: { type: String, required: true },
  },
  { timestamps: true },
);

export const OwnerModel = mongoose.models.Owner ?? mongoose.model("Owner", OwnerSchema);
