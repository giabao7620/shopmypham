// backend/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// 🧑‍💻 Tạo admin (test nhanh)
router.get("/create-admin", async (req, res) => {
    try {
        const hashed = await bcrypt.hash("123456", 10);
        const admin = new User({
            name: "Admin",
            email: "admin@example.com",
            password: hashed,
            role: "admin",
        });
        await admin.save();
        res.json({ message: "✅ Admin created successfully!", admin });
    } catch (err) {
        res.status(500).json({ message: "❌ Error creating admin", error: err.message });
    }
});

module.exports = router;
