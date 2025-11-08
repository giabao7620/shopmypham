const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrdersByUserId,
  getAllOrders,
  updateOrderStatus,
  getTopSellingProducts
} = require("../controllers/orderController");

// Tạo đơn hàng mới
router.post("/checkout", createOrder);

// Lấy đơn hàng theo userId
router.get("/user/:userId", getOrdersByUserId);

// Lấy tất cả đơn hàng (admin)
router.get("/", getAllOrders);

// Cập nhật trạng thái đơn hàng
router.put("/:orderId/status", updateOrderStatus);

// Lấy top sản phẩm bán chạy
router.get("/top-selling", getTopSellingProducts);

module.exports = router;