const express = require("express");
const {
  getAllCategories,
  getCategoryById,
  createCategory
} = require("../controllers/categoryController");

const router = express.Router();

// GET /categories - Lấy tất cả categories
router.get("/", getAllCategories);

// GET /categories/:id - Lấy category theo ID
router.get("/:id", getCategoryById);

// POST /categories - Tạo category mới
router.post("/", createCategory);

module.exports = router;