const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, maxlength: 100 },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, maxlength: 20 },
    address: { type: String, maxlength: 255 },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
  },
  { timestamps: true } // tự thêm createdAt, updatedAt
);

const User = mongoose.model("User", userSchema);

module.exports = User;


