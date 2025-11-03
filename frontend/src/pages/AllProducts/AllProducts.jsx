import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

export default function AllProducts() {
  const { navigateTo, addToCart, viewProduct } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    try {
      const response = await fetch('http://localhost:8888/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '50px', height: '50px', border: '3px solid #e91e63', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
        <p style={{ color: '#666', fontSize: '16px' }}>Đang tải sản phẩm...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <header style={{ backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
            <div onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '28px',
                background: 'linear-gradient(90deg, #f8b500, #ff6f91, #a86ff0, #f8b500)',
                backgroundSize: '300% 100%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                fontWeight: '600',
                margin: 0,
                lineHeight: '1',
                animation: 'gradientMove 3s ease-in-out infinite'
              }}>
                BeautyStore
              </h1>
              <p style={{ color: '#555', letterSpacing: '2px', fontSize: '9px', margin: '2px 0 0 0', textAlign: 'center' }}>COSMETICS</p>
            </div>
            <button 
              onClick={() => navigateTo('home')}
              style={{ 
                padding: '8px 16px', 
                backgroundColor: 'transparent', 
                color: '#e91e63', 
                border: '1px solid #e91e63', 
                borderRadius: '20px', 
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Quay lại
            </button>
          </div>
        </div>
      </header>

      <section style={{ backgroundColor: '#f8f9fa', padding: '30px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#333', margin: 0 }}>Tất cả sản phẩm</h2>
            <span style={{ backgroundColor: 'white', color: '#666', padding: '8px 16px', borderRadius: '25px', fontSize: '14px' }}>
              {products.length} sản phẩm
            </span>
          </div>
        </div>
      </section>

      <main style={{ padding: '50px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
            {products.map(product => (
              <div key={product._id} style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onClick={() => viewProduct(product._id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}>
                <img 
                  src={product.image} 
                  alt={product.name}
                  style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                />
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 10px 0', color: '#333' }}>
                    {product.name}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#e91e63', margin: 0 }}>
                      {product.price.toLocaleString()}đ
                    </p>
                    <p style={{ fontSize: '13px', color: '#999', margin: 0 }}>Còn {product.stock}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: '#e91e63',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Thêm vào giỏ hàng
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}