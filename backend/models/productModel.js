// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema(
//   {
//     id: { type: String, required: true, unique: true },
//     name: { type: String, required: true },
//     description: { type: String },
//     price: { type: Number, required: true },
//     stock: { type: Number, default: 0 }, // số lượng tồn kho
//     image: { type: String }, // URL hình ảnh
//     category: { type: String }, // danh mục
//   },
//   { timestamps: true } // tự động có createdAt, updatedAt
// );

// const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
// module.exports = Product;

const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: { type: String }, // Ảnh chính
  images: [{ type: String }], // Mảng nhiều ảnh
  subcategories_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory' },
});

module.exports = mongoose.model("Product", productSchema);
