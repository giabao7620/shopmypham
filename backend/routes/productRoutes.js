// const express = require("express");
// const router = express.Router();
// const { 
//   getAllProducts, 
//   getProductByCustomId, 
//   createProduct, 
//   getProductById, 
//   deleteProduct 
// } = require("../controllers/productController");

// // Lấy tất cả sản phẩm
// router.get("/", getAllProducts);

// // Lấy sản phẩm theo custom id (ưu tiên cụ thể trước)
// router.get("/custom/:id", getProductByCustomId);

// // Tạo sản phẩm mới
// router.post("/", createProduct);

// // Xoá sản phẩm theo _id MongoDB
// router.delete("/:id", deleteProduct);

// // Lấy sản phẩm theo _id (MongoDB)
// router.get("/:id", getProductById);

// module.exports = router;


const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload"); // 🔹 thêm upload multer

const { 
  getAllProducts, 
  getProductByCustomId, 
  getProductsBySubcategoryId,
  getProductsBySubcategoryIdSortHighToLow,
  getProductsBySubcategoryIdSortLowToHigh,
  createProduct, 
  getProductById, 
  updateProduct,
  deleteProduct 
} = require("../controllers/productController");

// Lấy tất cả sản phẩm
router.get("/", getAllProducts);

// Lấy sản phẩm theo custom id (ưu tiên cụ thể trước)
router.get("/custom/:id", getProductByCustomId);

// Lấy sản phẩm theo subcategory ID
router.get("/subcategory/:subcategoryId", getProductsBySubcategoryId);

// Lấy sản phẩm theo subcategory ID sắp xếp giá cao đến thấp
router.get("/subcategory/:subcategoryId/sort/high-to-low", getProductsBySubcategoryIdSortHighToLow);

// Lấy sản phẩm theo subcategory ID sắp xếp giá thấp đến cao
router.get("/subcategory/:subcategoryId/sort/low-to-high", getProductsBySubcategoryIdSortLowToHigh);

// ✅ Tạo sản phẩm mới kèm upload ảnh
router.post("/", upload.array("images", 10), createProduct);

// ✅ Cập nhật sản phẩm
router.put("/:id", updateProduct);

// Xoá sản phẩm theo _id MongoDB
router.delete("/:id", deleteProduct);

// Lấy sản phẩm theo _id (MongoDB)
router.get("/:id", getProductById);

module.exports = router;
