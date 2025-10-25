import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import Header from "../../components/Header";
import "./productdetail.css";
import "../Home/home.css";

export default function ProductDetail() {
  const { selectedProductId, navigateTo, addToCart } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product with ID:', selectedProductId);
        console.log('ID type:', typeof selectedProductId);
        console.log('ID length:', selectedProductId?.length);

        const response = await fetch(`http://localhost:8888/products/${selectedProductId}`);
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (response.ok) {
          setProduct(data);
        } else {
          console.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedProductId) {
      fetchProduct();
    }
  }, [selectedProductId]);

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="container">
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-error">
        <div className="container">
          <p>Không tìm thấy sản phẩm</p>
          <button onClick={() => navigateTo("home")} className="back-btn">
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Header />

      <div className="product-detail-content">
        <div className="container">
          <div className="product-detail-grid">
            <div className="product-image-section">
              <div className="product-image">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "100%", height: "500px", objectFit: "contain", }}
                  />
                ) : (
                  "🧴"
                )}
              </div>
            </div>

            <div className="product-info-section">
              <h1 className="product-title">{product.name}</h1>
              <p className="product-price">
                {product.price?.toLocaleString()}đ
              </p>

              {product.description && (
                <div className="product-description">
                  <h3>Mô tả sản phẩm</h3>
                  <p>{product.description}</p>
                </div>
              )}

              <div className="product-stock">
                <p>Còn lại: {product.stock || 0} sản phẩm</p>
              </div>

              {product.category && (
                <div className="product-category">
                  <p>Danh mục: {product.category}</p>
                </div>
              )}

              <div className="product-actions">
                <button 
                  className="add-to-cart-btn-large"
                  onClick={() => {
                    addToCart(product, 1);
                    alert('Đã thêm vào giỏ hàng!');
                  }}
                >
                  Thêm vào giỏ hàng
                </button>
                <button 
                  className="buy-now-btn"
                  onClick={() => {
                    addToCart(product, 1);
                    navigateTo('checkout');
                  }}
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



