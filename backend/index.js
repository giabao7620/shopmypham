// const express = require("express");
// const connectDB = require("./config/db");
// const userRoutes = require("./routes/userRoutes");

// const app = express();

// // CORS middleware
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   if (req.method === 'OPTIONS') {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// });

// // Middleware để đọc JSON từ Postman
// app.use(express.json());

// // Kết nối MongoDB
// connectDB();

// // Route test
// app.get("/", (req, res) => {
//   res.send("Hello MongoDB!");
// });

// // Gắn route users
// app.use("/users", userRoutes);

// const PORT = process.env.PORT || 8888;
// app.listen(PORT, () =>
//   console.log(`🚀 Server chạy tại http://localhost:${PORT}`)
// );


const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes"); // 🔹 thêm route products
const categoryRoutes = require("./routes/categoryRoutes"); // 🔹 thêm route categories
const subcategoryRoutes = require("./routes/subcategoryRoutes"); // 🔹 thêm route subcategories
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware để đọc JSON từ Postman
app.use(express.json());

// Kết nối MongoDB
connectDB();

// Route test
app.get("/", (req, res) => {
  res.send("Hello MongoDB!");
});

// Gắn route users
app.use("/users", userRoutes);

// 🔹 Gắn route products
app.use("/products", productRoutes);

// 🔹 Gắn route categories
app.use("/categories", categoryRoutes);

// 🔹 Gắn route subcategories
app.use("/subcategories", subcategoryRoutes);

app.use("/cart", require("./routes/cartRoutes"));
app.use("/orders", require("./routes/orderRoutes"));
app.use("/admin", adminRoutes);
const PORT = process.env.PORT || 8888;
app.listen(PORT, () =>
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`)
);
