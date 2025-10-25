const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

router.post("/checkout", async (req, res) => {
  try {
    const { userId, items } = req.body;

    const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    const order = await Order.create({
      user: userId,
      items: items.map(i => ({
        product: i.product._id,
        quantity: i.quantity,
      })),
      totalPrice,
    });

    res.json({ message: "Đặt hàng thành công!", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
