const ProductSpecs = require("../models/productSpecsModel");

// Tạo thông số sản phẩm mới
const createProductSpecs = async (req, res) => {
  try {
    const { productId, brand, brandOrigin, skinType, volume } = req.body;
    
    const productSpecs = new ProductSpecs({
      productId,
      brand,
      brandOrigin,
      skinType,
      volume
    });

    const savedSpecs = await productSpecs.save();
    res.status(201).json(savedSpecs);
  } catch (error) {
    res.status(400).json({ message: "Lỗi tạo thông số sản phẩm", error: error.message });
  }
};

// Lấy tất cả thông số sản phẩm
const getAllProductSpecs = async (req, res) => {
  try {
    const specs = await ProductSpecs.find().populate('productId');
    res.json(specs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông số theo productId
const getProductSpecsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;
    const specs = await ProductSpecs.findOne({ productId }).populate('productId');
    
    if (!specs) {
      return res.status(404).json({ message: "Không tìm thấy thông số sản phẩm" });
    }
    
    res.json(specs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông số theo ID
const getProductSpecsById = async (req, res) => {
  try {
    const { id } = req.params;
    const specs = await ProductSpecs.findById(id).populate('productId');
    
    if (!specs) {
      return res.status(404).json({ message: "Không tìm thấy thông số sản phẩm" });
    }
    
    res.json(specs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông số sản phẩm
const updateProductSpecs = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const specs = await ProductSpecs.findByIdAndUpdate(id, updateData, { new: true }).populate('productId');
    
    if (!specs) {
      return res.status(404).json({ message: "Không tìm thấy thông số sản phẩm" });
    }
    
    res.json({ message: "Cập nhật thông số thành công", specs });
  } catch (error) {
    res.status(500).json({ message: "Lỗi cập nhật", error: error.message });
  }
};

// Xóa thông số sản phẩm
const deleteProductSpecs = async (req, res) => {
  try {
    const { id } = req.params;
    
    const specs = await ProductSpecs.findByIdAndDelete(id);
    
    if (!specs) {
      return res.status(404).json({ message: "Không tìm thấy thông số sản phẩm" });
    }
    
    res.json({ message: "Xóa thông số thành công", specs });
  } catch (error) {
    res.status(500).json({ message: "Lỗi xóa", error: error.message });
  }
};

module.exports = {
  createProductSpecs,
  getAllProductSpecs,
  getProductSpecsByProductId,
  getProductSpecsById,
  updateProductSpecs,
  deleteProductSpecs
};