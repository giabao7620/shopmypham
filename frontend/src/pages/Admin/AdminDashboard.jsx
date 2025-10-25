// import { useState, useEffect } from "react";
// import axios from "axios";

// export default function AdminDashboard() {
//   const [products, setProducts] = useState([]);
//   const token = localStorage.getItem("adminToken");

//   useEffect(() => {
//     axios.get("http://localhost:3000/api/products")
//       .then(res => setProducts(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   const deleteProduct = async (id) => {
//     if (!window.confirm("Xóa sản phẩm này?")) return;
//     await axios.delete(`http://localhost:3000/api/products/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setProducts(products.filter(p => p._id !== id));
//   };

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-4">Quản lý sản phẩm</h1>
//       <table className="w-full border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="p-2 border">Tên</th>
//             <th className="p-2 border">Giá</th>
//             <th className="p-2 border">Hành động</th>
//           </tr>
//         </thead>
//         <tbody>
//           {products.map(p => (
//             <tr key={p._id}>
//               <td className="border p-2">{p.name}</td>
//               <td className="border p-2">{p.price}</td>
//               <td className="border p-2">
//                 <button className="bg-red-500 text-white px-3 py-1 mr-2"
//                   onClick={() => deleteProduct(p._id)}>Xóa</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    subcategories_id: "",
    image: "",
  });
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:8888/products"; // 🔹 đúng endpoint

  // 🧾 Lấy danh sách sản phẩm
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API_URL);
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✏️ Thêm hoặc cập nhật sản phẩm
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        alert("✅ Cập nhật sản phẩm thành công!");
      } else {
        await axios.post(API_URL, formData);
        alert("✅ Thêm sản phẩm thành công!");
      }
      setFormData({ name: "", description: "", price: "", stock: "", subcategories_id: "", image: "" });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error("❌ Lỗi khi lưu sản phẩm:", err);
    }
  };

  // 🗑️ Xóa sản phẩm
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      alert("🗑️ Đã xóa sản phẩm");
      fetchProducts();
    } catch (err) {
      console.error("❌ Lỗi khi xóa:", err);
    }
  };

  // 🧰 Chọn sản phẩm để sửa
  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      subcategories_id: product.subcategories_id || "",
      image: product.image || "",
    });
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ color: "#e91e63", textAlign: "center" }}>🛍️ Quản lý sản phẩm</h1>

      {/* Form thêm / sửa */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "40px" }}>
        <input
          type="text"
          placeholder="Tên sản phẩm"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Mô tả"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Giá"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Tồn kho"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
        />
        <input
          type="text"
          placeholder="ID danh mục con (subcategory)"
          value={formData.subcategories_id}
          onChange={(e) => setFormData({ ...formData, subcategories_id: e.target.value })}
        />
        <input
          type="text"
          placeholder="URL hình ảnh"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        />
        <button type="submit" style={{ marginTop: "10px", background: "#e91e63", color: "#fff" }}>
          {editingId ? "💾 Cập nhật" : "➕ Thêm sản phẩm"}
        </button>
      </form>

      {/* Danh sách sản phẩm */}
      <div>
        <h2>📋 Danh sách sản phẩm</h2>
        {products.length === 0 ? (
          <p>Chưa có sản phẩm nào.</p>
        ) : (
          <table border="1" width="100%" cellPadding="10" style={{ borderCollapse: "collapse" }}>
            <thead style={{ background: "#f8bbd0" }}>
              <tr>
                <th>Tên</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Hình ảnh</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    {p.image ? (
                      <img src={p.image} alt={p.name} width="50" />
                    ) : (
                      "Không có hình"
                    )}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(p)}>✏️ Sửa</button>{" "}
                    <button onClick={() => handleDelete(p._id)}>🗑️ Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
