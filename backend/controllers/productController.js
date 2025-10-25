// const Product = require("../models/productModel");

// // Lấy tất cả sản phẩm
// const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Lấy sản phẩm theo MongoDB _id
// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Lấy sản phẩm theo custom id (id riêng)
// const getProductByCustomId = async (req, res) => {
//   try {
//     const product = await Product.findOne({ id: req.params.id }); // tìm theo trường id
//     if (!product) {
//       return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
//     }
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // ✅ Tạo sản phẩm mới
// const createProduct = async (req, res) => {
//   try {
//     const {id, name, description, price, stock, image, category } = req.body;

//     const product = new Product({
//         id,
//       name,
//       description,
//       price,
//       stock,
//       image,
//       category,
//     });

//     const savedProduct = await product.save();
//     res.status(201).json(savedProduct);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Xoá sản phẩm theo ID
// const deleteProduct = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const product = await Product.findByIdAndDelete(id); // xoá theo _id MongoDB

//     if (!product) {
//       return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
//     }

//     res.json({ message: "Xoá sản phẩm thành công", product });
//   } catch (err) {
//     res.status(500).json({ message: "Lỗi server", error: err.message });
//   }
// };
// module.exports = { getAllProducts, getProductById, createProduct, getProductByCustomId, deleteProduct };

const Product = require("../models/productModel");
const cloudinary = require("../config/cloudinary");

// Lấy tất cả sản phẩm
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy sản phẩm theo MongoDB _id
const getProductById = async (req, res) => {
  try {
    console.log('Backend received ID:', req.params.id, 'Type:', typeof req.params.id);
    
    const product = await Product.findById(req.params.id).select('-_id -__v');
    
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(product);
  } catch (error) {
    console.error('Error in getProductById:', error);
    res.status(500).json({ message: error.message });
  }
};

// Lấy sản phẩm theo custom id (id riêng)
const getProductByCustomId = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Tạo sản phẩm mới (có upload ảnh lên Cloudinary)
// const createProduct = async (req, res) => {
//   try {
//     const { id, name, description, price, stock, category } = req.body;

//     let imageUrl = null;

//     // Nếu có file ảnh gửi kèm
//     if (req.file) {
//       const result = await new Promise((resolve, reject) => {
//         cloudinary.uploader.upload_stream(
//           { folder: "products" }, // Lưu ảnh vào folder "products" trên Cloudinary
//           (error, result) => {
//             if (error) reject(error);
//             else resolve(result);
//           }
//         ).end(req.file.buffer);
//       });

//       imageUrl = result.secure_url;
//     }

//     const product = new Product({
//       id,
//       name,
//       description,
//       price,
//       stock,
//       image: imageUrl, // 🔹 link ảnh Cloudinary
//       category,
//     });

//     const savedProduct = await product.save();
//     res.status(201).json(savedProduct);
//   } catch (error) {
//     res.status(400).json({ message: "Lỗi tạo sản phẩm", error: error.message });
//   }
// };


const createProduct = async (req, res) => {
  try {
    console.log('Full req.body:', req.body);
    const { name, description, price, stock, subcategories_id, image } = req.body;
    console.log('Extracted data:', { name, description, price, stock, subcategories_id, image });

    let imageUrl = image; // Sử dụng URL từ form input

    // Nếu có file ảnh gửi kèm (upload file)
    if (req.file) {
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { folder: "products" }, // Lưu ảnh vào folder "products" trên Cloudinary
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(req.file.buffer);
        });

        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("❌ Lỗi upload ảnh lên Cloudinary:", uploadError);
        return res.status(500).json({ message: "Upload ảnh thất bại" });
      }
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      image: imageUrl, // 🔹 link ảnh từ URL hoặc Cloudinary
      subcategories_id,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("❌ Lỗi tạo sản phẩm:", error); // 🔹 log lỗi ra console
    res.status(400).json({ message: "Lỗi tạo sản phẩm", error: error.message });
  }
};

// Lấy sản phẩm theo subcategory ID
const getProductsBySubcategoryId = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const products = await Product.find({ subcategories_id: subcategoryId });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy sản phẩm theo subcategory ID sắp xếp giá cao đến thấp
const getProductsBySubcategoryIdSortHighToLow = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const products = await Product.find({ subcategories_id: subcategoryId }).sort({ price: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy sản phẩm theo subcategory ID sắp xếp giá thấp đến cao
const getProductsBySubcategoryIdSortLowToHigh = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const products = await Product.find({ subcategories_id: subcategoryId }).sort({ price: 1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log('Updating product:', id, 'with data:', updateData);
    
    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    
    res.json({ message: "Cập nhật sản phẩm thành công", product });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

// Xoá sản phẩm theo ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id); // Xoá theo _id MongoDB

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.json({ message: "Xoá sản phẩm thành công", product });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductByCustomId,
  getProductsBySubcategoryId,
  getProductsBySubcategoryIdSortHighToLow,
  getProductsBySubcategoryIdSortLowToHigh,
  createProduct,
  updateProduct,
  deleteProduct,
};
