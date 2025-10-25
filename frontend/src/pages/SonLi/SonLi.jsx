import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import "./sonli.css";

export default function SonLi() {
  const { user, logout, viewProduct, navigateTo, addToCart } = useApp();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchSonLiProducts = async () => {
      try {
        const res = await fetch("http://localhost:8888/products/category/68e9e5953473a3fb777f9319");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm son lì:", err);
      }
    };

    fetchSonLiProducts();
  }, []);

  return (
    <div className="sonli-page">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <h1 className="logo" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
              <span className="pink">Beauty</span>
              <span className="gray">Store</span>
            </h1>

            <div className="auth-buttons">
              {user ? (
                <>
                  <span className="user-name">Xin chào, {user.name}</span>
                  <button onClick={logout} className="btn logout-btn">
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigateTo("register")} className="btn">
                    Đăng ký
                  </button>
                  <button onClick={() => navigateTo("login")} className="btn">
                    Đăng nhập
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <span onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>Trang chủ</span>
          <span> / </span>
          <span>Son lì</span>
        </div>
      </div>

      {/* Products */}
      <section className="products">
        <div className="container">
          <h2 className="page-title">Son lì</h2>
          <div className="product-grid">
            {products.map((product) => (
              <div
                key={product._id}
                className="product-card"
                onClick={() => viewProduct(product._id)}
              >
                <div className="product-image">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: "100%", height: "200px", objectFit: "contain" }}
                    />
                  ) : (
                    "💄"
                  )}
                </div>
                <h4 className="product-name">{product.name}</h4>
                <p className="product-price">
                  {product.price?.toLocaleString()}đ
                </p>
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, 1);
                  }}
                >
                  Thêm vào giỏ
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}