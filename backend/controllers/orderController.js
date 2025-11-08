const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// Tạo đơn hàng mới
const createOrder = async (req, res) => {
  try {
    console.log('Received order data:', req.body);
    const { userId, items, customerInfo, subtotal, shippingFee, total, paymentMethod, note } = req.body;
    
    console.log('Items structure:', JSON.stringify(items, null, 2));

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Không có sản phẩm trong đơn hàng" });
    }

    // Kiểm tra số lượng tồn kho trước khi đặt hàng
    console.log('Bắt đầu kiểm tra tồn kho:');
    for (const item of items) {
      console.log(`Kiểm tra sản phẩm ID: ${item.product._id}`);
      
      // Kiểm tra xem item.product._id có hợp lệ không
      if (!item.product._id) {
        console.error('Product ID không hợp lệ:', item);
        return res.status(400).json({ message: 'Dữ liệu sản phẩm không hợp lệ' });
      }
      
      const product = await Product.findById(item.product._id);
      console.log(`Sản phẩm tìm thấy:`, product);
      
      if (!product) {
        console.error(`Không tìm thấy sản phẩm ID: ${item.product._id}`);
        return res.status(400).json({ message: `Sản phẩm ${item.product.name || 'không xác định'} không tồn tại` });
      }
      
      console.log(`Stock hiện tại: ${product.stock}, Số lượng đặt: ${item.quantity}`);
      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Sản phẩm ${item.product.name} chỉ còn ${product.stock} sản phẩm trong kho` 
        });
      }
    }
    console.log('Kiểm tra tồn kho hoàn thành');

    const orderItems = items.map(item => {
      if (!item.product || !item.product._id) {
        throw new Error(`Dữ liệu sản phẩm không hợp lệ: ${JSON.stringify(item)}`);
      }
      return {
        productId: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price
      };
    });

    console.log('Order items:', orderItems);

    // Kiểm tra customerInfo
    if (!customerInfo || !customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      return res.status(400).json({ message: 'Thông tin khách hàng không đầy đủ' });
    }

    const order = new Order({
      userId,
      items: orderItems,
      shippingInfo: {
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: `${customerInfo.address}, ${customerInfo.districtName || customerInfo.district}, ${customerInfo.cityName || customerInfo.city}`,
        email: customerInfo.email || ''
      },
      paymentMethod: paymentMethod || "COD",
      totalAmount: total,
      note: note || ''
    });

    console.log('Creating order:', order);
    const savedOrder = await order.save();
    console.log('Order saved:', savedOrder._id);
    
    // Trừ số lượng sản phẩm trong kho
    console.log('Bắt đầu cập nhật stock cho các sản phẩm:');
    for (const item of items) {
      console.log(`Cập nhật stock cho sản phẩm ID: ${item.product._id}, trừ ${item.quantity}`);
      
      const productBefore = await Product.findById(item.product._id);
      console.log(`Stock trước khi cập nhật: ${productBefore?.stock}`);
      
      const updatedProduct = await Product.findByIdAndUpdate(
        item.product._id,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
      
      console.log(`Stock sau khi cập nhật: ${updatedProduct?.stock}`);
      
      if (!updatedProduct) {
        console.error(`Không tìm thấy sản phẩm với ID: ${item.product._id}`);
      }
    }
    console.log('Hoàn thành cập nhật stock');
    
    res.status(201).json({ 
      message: "Đặt hàng thành công!", 
      orderId: savedOrder._id 
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: "Lỗi tạo đơn hàng", error: error.message });
  }
};

// Lấy đơn hàng theo userId
const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả đơn hàng (admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status, paymentStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.json({ message: "Cập nhật trạng thái thành công", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy top sản phẩm bán chạy
const getTopSellingProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const topProducts = await Order.aggregate([
      // Unwind items array để tách từng sản phẩm
      { $unwind: "$items" },
      
      // Group theo productId và tính tổng số lượng bán
      {
        $group: {
          _id: "$items.productId",
          totalSold: { $sum: "$items.quantity" },
          productName: { $first: "$items.name" },
          productPrice: { $first: "$items.price" }
        }
      },
      
      // Sắp xếp theo số lượng bán giảm dần
      { $sort: { totalSold: -1 } },
      
      // Giới hạn số lượng kết quả
      { $limit: parseInt(limit) },
      
      // Lookup để lấy thông tin chi tiết sản phẩm
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      
      // Unwind productDetails
      { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
      
      // Project kết quả cuối cùng
      {
        $project: {
          _id: 1,
          totalSold: 1,
          name: { $ifNull: ["$productDetails.name", "$productName"] },
          price: { $ifNull: ["$productDetails.price", "$productPrice"] },
          image: "$productDetails.image",
          stock: "$productDetails.stock"
        }
      }
    ]);
    
    res.json(topProducts);
  } catch (error) {
    console.error('Lỗi lấy top sản phẩm:', error);
    res.status(500).json({ message: "Lỗi lấy top sản phẩm bán chạy", error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrdersByUserId,
  getAllOrders,
  updateOrderStatus,
  getTopSellingProducts
};