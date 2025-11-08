const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  shippingInfo: {
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    email: {
      type: String
    }
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "MOMO", "BANK"],
    default: "COD"
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending"
  },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Shipping", "Delivered", "Canceled"],
    default: "Pending"
  },
  totalAmount: {
    type: Number,
    required: true
  },
  note: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);