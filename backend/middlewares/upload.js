// const multer = require("multer");
// const path = require("path");

// // Cấu hình lưu file tạm trên server
// const storage = multer.diskStorage({
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // tên file = timestamp + đuôi file
//   }
// });

// // Bộ lọc chỉ cho phép ảnh
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Chỉ cho phép upload ảnh!"), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// module.exports = upload;

const multer = require("multer");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép upload ảnh!"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
