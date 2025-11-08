const mongoose = require("mongoose");

const productSpecsSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
  brand: { type: String, required: true }, // Thương hiệu
  brandOrigin: { type: String, required: true }, // Xuất xứ thương hiệu
  skinType: { type: String, required: true }, // Loại da
  volume: { type: String, required: true }, // Dung tích
}, { timestamps: true });

module.exports = mongoose.model("ProductSpecs", productSpecsSchema);