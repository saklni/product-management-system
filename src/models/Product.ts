import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    name: String,
    price: Number,
    category: String,
    description: String,
    image: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);