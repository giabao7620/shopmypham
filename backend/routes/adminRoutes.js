const express = require("express");
const router = express.Router();
const Product = require("../models/productModel");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const { verifyToken, isAdmin } = require("../middlewares/authMiddleware");

// Tạo admin
router.post("/create-admin", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const admin = new User({ name, email, password: hashedPassword, role: "admin" });
        await admin.save();
        res.status(201).json({ message: "Tạo admin thành công", admin: { id: admin._id, name, email, role: "admin" } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Xem danh sách sản phẩm
router.get("/products", verifyToken, isAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const products = await Product.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('category_id');
        const total = await Product.countDocuments();
        res.json({ products, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm" });
    }
});

// Thêm sản phẩm
router.post("/products", verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, price } = req.body;
        if (!name || !price) {
            return res.status(400).json({ message: "Tên và giá sản phẩm là bắt buộc" });
        }
        const product = new Product(req.body);
        await product.save();
        res.json({ message: "Đã thêm sản phẩm thành công", product });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi thêm sản phẩm" });
    }
});

// Sửa sản phẩm
router.put("/products/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        res.json({ message: "Đã cập nhật sản phẩm", product });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi sửa sản phẩm" });
    }
});

// Xóa sản phẩm
router.delete("/products/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        res.json({ message: "Đã xóa sản phẩm" });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi xóa sản phẩm" });
    }
});

module.exports = router;
