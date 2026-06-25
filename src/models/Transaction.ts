import mongoose, { Schema } from "mongoose";

const TransactionSchema = new Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: {
          type: String,
          required: true,
        },
        qty: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        subtotal: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
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

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
