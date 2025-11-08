const express = require("express");
const router = express.Router();
const {
  createProductSpecs,
  getAllProductSpecs,
  getProductSpecsByProductId,
  getProductSpecsById,
  updateProductSpecs,
  deleteProductSpecs
} = require("../controllers/productSpecsController");

// Tạo thông số sản phẩm mới
router.post("/", createProductSpecs);

// Lấy tất cả thông số sản phẩm
router.get("/", getAllProductSpecs);

// Lấy thông số theo productId
router.get("/product/:productId", getProductSpecsByProductId);

// Lấy thông số theo ID
router.get("/:id", getProductSpecsById);

// Cập nhật thông số sản phẩm
router.put("/:id", updateProductSpecs);

// Xóa thông số sản phẩm
router.delete("/:id", deleteProductSpecs);

module.exports = router;