import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Category ||
  mongoose.model("Category", CategorySchema);