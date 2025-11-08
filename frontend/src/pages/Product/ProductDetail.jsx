import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import Header from "../../components/Header";
import "./productdetail.css";
import "../Home/home.css";

export default function ProductDetail() {
  const { selectedProductId, navigateTo, addToCart } = useApp();
  const [product, setProduct] = useState(null);
  const [productSpecs, setProductSpecs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

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
          
          // Lấy thông số sản phẩm
          try {
            const specsResponse = await fetch(`http://localhost:8888/product-specs/product/${selectedProductId}`);
            if (specsResponse.ok) {
              const specsData = await specsResponse.json();
              setProductSpecs(specsData);
            }
          } catch (specsError) {
            console.log('Không có thông số sản phẩm:', specsError);
          }
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
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <Header />

      {/* Breadcrumb */}
      <div style={{ backgroundColor: 'white', padding: '10px 0', borderBottom: '1px solid #eee' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>
            <span onClick={() => navigateTo('home')} style={{ cursor: 'pointer', color: '#007bff' }}>Trang chủ</span>
            <span style={{ margin: '0 8px' }}>›</span>
            <span>{product.name}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', backgroundColor: 'white', padding: '30px', borderRadius: '8px', position: 'relative' }}>

          {/* Left - Product Images */}
          <div style={{ display: 'flex', gap: '15px' }}>
            {/* Thumbnail Images */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Ảnh chính */}
              {product.image && (
                <div 
                  onClick={() => setSelectedImageIndex(-1)}
                  style={{
                    width: '80px', height: '80px', 
                    border: selectedImageIndex === -1 ? '2px solid #ff6b35' : '1px solid #ddd',
                    borderRadius: '8px', cursor: 'pointer', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: '#f8f9fa', overflow: 'hidden'
                  }}
                >
                  <img src={product.image} alt="" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
                </div>
              )}
              
              {/* Các ảnh phụ */}
              {product.images && product.images.map((img, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  style={{
                    width: '80px', height: '80px', 
                    border: selectedImageIndex === index ? '2px solid #ff6b35' : '1px solid #ddd',
                    borderRadius: '8px', cursor: 'pointer', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: '#f8f9fa', overflow: 'hidden'
                  }}
                >
                  <img src={img} alt="" style={{ width: '70px', height: '70px', objectFit: 'contain' }} />
                </div>
              ))}
            </div>
            
            {/* Main Image Display */}
            <div style={{ flex: 1, position: 'relative' }}>
              <div 
                style={{ 
                  border: '1px solid #ddd', borderRadius: '8px', padding: '20px', backgroundColor: '#f8f9fa',
                  position: 'relative'
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setMousePosition({
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top) / rect.height) * 100
                  });
                }}
              >
                {(() => {
                  let currentImage = product.image;
                  if (selectedImageIndex >= 0 && product.images && product.images[selectedImageIndex]) {
                    currentImage = product.images[selectedImageIndex];
                  }
                  
                  return currentImage ? (
                    <img 
                      src={currentImage} 
                      alt={product.name} 
                      style={{ width: '100%', height: '400px', objectFit: 'contain' }} 
                    />
                  ) : (
                    <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>🧴</div>
                  );
                })()}
              </div>
              
              {/* Zoom Window */}
              {isHovering && (() => {
                let currentImage = product.image;
                if (selectedImageIndex >= 0 && product.images && product.images[selectedImageIndex]) {
                  currentImage = product.images[selectedImageIndex];
                }
                return currentImage && (
                  <div style={{
                    position: 'absolute', top: '0', right: '-320px', 
                    width: '300px', height: '300px',
                    border: '1px solid #ddd', borderRadius: '8px',
                    backgroundColor: 'white', overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    zIndex: 10
                  }}>
                    <img 
                      src={currentImage} 
                      alt={product.name}
                      style={{
                        width: '800px', height: '800px', objectFit: 'contain',
                        position: 'absolute',
                        left: `-${(mousePosition.x / 100) * 500}px`,
                        top: `-${(mousePosition.y / 100) * 500}px`
                      }}
                    />
                  </div>
                );
              })()}
              
            </div>
          </div>

          {/* Right - Product Info */}
          <div>
            {/* Product Name */}
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', marginBottom: '20px', lineHeight: '1.3' }}>
              {product.name}
            </h1>

            {/* Price */}
            <div style={{ marginBottom: '30px' }}>
              <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff6b35' }}>{product.price?.toLocaleString()}đ</span>
            </div>

            {/* Stock */}
            <div style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
              <p style={{ color: '#28a745', fontSize: '16px', fontWeight: 'bold', margin: 0 }}>Còn lại: {product.stock || 0} sản phẩm</p>
            </div>

            {/* Quantity & Actions */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{ padding: '10px 15px', border: 'none', backgroundColor: 'white', cursor: 'pointer', fontSize: '16px' }}
                >-</button>
                <span style={{ padding: '10px 20px', borderLeft: '1px solid #ddd', borderRight: '1px solid #ddd', fontSize: '16px' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{ padding: '10px 15px', border: 'none', backgroundColor: 'white', cursor: 'pointer', fontSize: '16px' }}
                >+</button>
              </div>

              <button
                onClick={() => {
                  addToCart(product, quantity);
                  alert('Đã thêm vào giỏ hàng!');
                }}
                style={{
                  padding: '12px 24px', backgroundColor: '#ff6b35', color: 'white', border: 'none',
                  borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px'
                }}
              >
                THÊM VÀO GIỎ HÀNG
              </button>

              <button
                onClick={() => {
                  addToCart(product, quantity);
                  navigateTo('checkout');
                }}
                style={{
                  padding: '12px 24px', backgroundColor: '#007bff', color: 'white', border: 'none',
                  borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px'
                }}
              >
                MUA NGAY
              </button>
            </div>

          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div style={{ backgroundColor: 'white', marginTop: '20px', borderRadius: '8px', overflow: 'hidden' }}>
          {/* Tab Navigation */}
          <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
            {[
              { key: 'description', label: 'Mô tả' },
              { key: 'specs', label: 'Thông số' },
              { key: 'ingredients', label: 'Thành phần' },
              { key: 'usage', label: 'HDSD' },
              { key: 'reviews', label: 'Đánh giá' },
              { key: 'qa', label: 'Hỏi đáp' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  document.getElementById(tab.key)?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  padding: '15px 20px', border: 'none', backgroundColor: 'transparent',
                  cursor: 'pointer', fontSize: '16px', fontWeight: '500',
                  color: activeTab === tab.key ? '#333' : '#666',
                  borderBottom: activeTab === tab.key ? '2px solid #ff6b35' : '2px solid transparent'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {/* All Content Sections */}
          <div style={{ padding: '30px' }}>
            {/* Mô tả */}
            <div id="description" style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Sữa Rửa Mặt {product.name}</h3>
              <div style={{ color: '#666', lineHeight: '1.8', fontSize: '15px' }}>
                {product.description ? (
                  <div style={{ whiteSpace: 'pre-line' }}>{product.description}</div>
                ) : (
                  <div>
                    <p><strong>Sữa Rửa Mặt Cerave Sạch Sâu</strong> là sản phẩm sữa rửa mặt đến từ thương hiệu mỹ phẩm <strong>Cerave</strong> của Mỹ, với sự kết hợp của ba Ceramides thiết yếu, Hyaluronic Acid sản phẩm giúp làm sạch và giữ ẩm cho làn da mà không ảnh hưởng đến hàng rào bảo vệ da mặt và cơ thể.</p>
                    
                    <p>Hiện sản phẩm <strong>Sữa Rửa Mặt Cerave Sạch Sâu</strong> đã có mặt tại <strong>Hasaki</strong> với 3 loại và 3 dung tích (88ml; 236ml; 473ml):</p>
                    
                    <ul style={{ paddingLeft: '20px', marginTop: '15px' }}>
                      <li style={{ marginBottom: '8px' }}>• Sữa Rửa Mặt Cerave Sạch Sâu Cho Da Thường Đến Da Dầu</li>
                      <li style={{ marginBottom: '8px' }}>• Sữa Rửa Mặt Cerave Sạch Sâu Cho Da Thường Đến Da Khô</li>
                      <li style={{ marginBottom: '8px' }}>• Sữa Rửa Mặt CeraVe Làm Sạch & Tẩy Tế Bào Chết Dịu Nhẹ</li>
                    </ul>
                    
                    <h4 style={{ fontSize: '18px', fontWeight: 'bold', margin: '25px 0 15px 0' }}>1. Sữa Rửa Mặt Cerave Sạch Sâu Cho Da Thường Đến Da Dầu</h4>
                    
                    <p>Sữa Rửa Mặt Cerave Foaming Cleanser kết cấu dạng gel tạo bọt rất ít tương đối loại bỏ dầu thừa, bụi bẩn và lớp trang điểm với công thức nhẹ nhàng. Không phá vỡ hàng rào bảo vệ tự nhiên của da và chứa các thành phần giúp duy trì độ ẩm cần thiết cho da. Cerave Foaming Cleanser chứa <strong>Ceramides, Axit Hyaluronic và Niacinamide</strong> giúp duy trì hàng rào bảo vệ da, khóa ẩm và làm dịu làn da của bạn.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Thông số */}
            <div id="specs" style={{ marginBottom: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Thông số sản phẩm</h3>
              {productSpecs ? (
                <div style={{ display: 'grid', gap: '15px' }}>
                  <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ width: '150px', fontWeight: '500' }}>Thương hiệu:</span>
                    <span style={{ color: '#666' }}>{productSpecs.brand}</span>
                  </div>
                  <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ width: '150px', fontWeight: '500' }}>Xuất xứ:</span>
                    <span style={{ color: '#666' }}>{productSpecs.brandOrigin}</span>
                  </div>
                  <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ width: '150px', fontWeight: '500' }}>Dung tích:</span>
                    <span style={{ color: '#666' }}>{productSpecs.volume}</span>
                  </div>
                  <div style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ width: '150px', fontWeight: '500' }}>Loại da:</span>
                    <span style={{ color: '#666' }}>{productSpecs.skinType}</span>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#666', fontStyle: 'italic' }}>
                  Chưa có thông số chi tiết cho sản phẩm này
                </div>
              )}
            </div>
            
            {/* Thành phần */}
            <div id="ingredients" style={{ marginBottom: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Thành phần chính</h3>
              <div style={{ color: '#666', lineHeight: '1.8' }}>
                <p><strong>Ceramides:</strong> Giúp khôi phục và duy trì hàng rào bảo vệ tự nhiên của da</p>
                <p><strong>Hyaluronic Acid:</strong> Giúp giữ ẩm cho da</p>
                <p><strong>Niacinamide:</strong> Giúp làm dịu da</p>
                <p><strong>MVE Technology:</strong> Công nghệ giải phóng từ từ các thành phần dưỡng ẩm suốt cả ngày</p>
              </div>
            </div>
            
            {/* HDSD */}
            <div id="usage" style={{ marginBottom: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Hướng dẫn sử dụng</h3>
              <div style={{ color: '#666', lineHeight: '1.8' }}>
                <p><strong>Bước 1:</strong> Làm ướt mặt với nước ấm</p>
                <p><strong>Bước 2:</strong> Lấy một lượng sản phẩm vừa đủ ra lòng bàn tay</p>
                <p><strong>Bước 3:</strong> Tạo bọt và massage nhẹ nhàng lên mặt</p>
                <p><strong>Bước 4:</strong> Rửa sạch với nước và thấm khô</p>
                <p><strong>Lưu ý:</strong> Sử dụng 2 lần/ngày vào buổi sáng và tối</p>
              </div>
            </div>
            
            {/* Đánh giá */}
            <div id="reviews" style={{ marginBottom: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Đánh giá sản phẩm</h3>
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <p>Chưa có đánh giá nào cho sản phẩm này</p>
                <button style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#ff6b35', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Viết đánh giá đầu tiên
                </button>
              </div>
            </div>
            
            {/* Hỏi đáp */}
            <div id="qa" style={{ marginBottom: '40px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px' }}>Hỏi đáp</h3>
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <p>Chưa có câu hỏi nào cho sản phẩm này</p>
                <button style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Đặt câu hỏi đầu tiên
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
