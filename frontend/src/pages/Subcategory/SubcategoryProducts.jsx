import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";

export default function SubcategoryProducts() {
  const { navigateTo, addToCart, viewProduct, subcategoryId, subcategoryName } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState('default');

  useEffect(() => {
    if (subcategoryId) {
      fetchProducts();
    }
  }, [subcategoryId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProducts = async (sort = 'default') => {
    try {
      let url = `http://localhost:8888/products/subcategory/${subcategoryId}`;
      if (sort === 'low-to-high') {
        url = `http://localhost:8888/products/subcategory/${subcategoryId}/sort/low-to-high`;
      } else if (sort === 'high-to-low') {
        url = `http://localhost:8888/products/subcategory/${subcategoryId}/sort/high-to-low`;
      }
      
      const response = await fetch(url);
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

  const handleSort = (type) => {
    setSortType(type);
    setLoading(true);
    fetchProducts(type);
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
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
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
                fontSize: '14px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e91e63';
                e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#e91e63';
              }}
            >
              ← Quay lại
            </button>
          </div>
        </div>
      </header>

      {/* Breadcrumb & Title */}
      <section style={{ backgroundColor: '#f8f9fa', padding: '30px 0', borderBottom: '1px solid #e9ecef' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', fontSize: '14px', color: '#666' }}>
            <span onClick={() => navigateTo('home')} style={{ cursor: 'pointer', color: '#e91e63' }}>Trang chủ</span>
            <span>›</span>
            <span>{subcategoryName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#333', margin: 0 }}>{subcategoryName}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ backgroundColor: 'white', color: '#666', padding: '8px 16px', borderRadius: '25px', fontSize: '14px', border: '1px solid #e9ecef' }}>
                {products.length} sản phẩm
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section style={{ backgroundColor: 'white', padding: '20px 0', borderBottom: '1px solid #e9ecef' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#666' }}>Sắp xếp theo giá:</span>
            <button
              onClick={() => handleSort('default')}
              style={{
                padding: '8px 16px',
                backgroundColor: sortType === 'default' ? '#e91e63' : 'transparent',
                color: sortType === 'default' ? 'white' : '#666',
                border: '1px solid #e9ecef',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              Mặc định
            </button>
            <button
              onClick={() => handleSort('low-to-high')}
              style={{
                padding: '8px 16px',
                backgroundColor: sortType === 'low-to-high' ? '#e91e63' : 'transparent',
                color: sortType === 'low-to-high' ? 'white' : '#666',
                border: '1px solid #e9ecef',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              Giá thấp → cao
            </button>
            <button
              onClick={() => handleSort('high-to-low')}
              style={{
                padding: '8px 16px',
                backgroundColor: sortType === 'high-to-low' ? '#e91e63' : 'transparent',
                color: sortType === 'high-to-low' ? 'white' : '#666',
                border: '1px solid #e9ecef',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              Giá cao → thấp
            </button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <main style={{ padding: '50px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
              <h3 style={{ fontSize: '24px', color: '#666', marginBottom: '10px' }}>Chưa có sản phẩm</h3>
              <p style={{ color: '#999' }}>Danh mục này hiện chưa có sản phẩm nào.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
              {products.map(product => (
                <div key={product._id} style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(233, 30, 99, 0.08)',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  cursor: 'pointer',
                  border: '1px solid rgba(233, 30, 99, 0.05)'
                }}
                onClick={() => viewProduct(product._id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(233, 30, 99, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(233, 30, 99, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(233, 30, 99, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(233, 30, 99, 0.05)';
                }}>
                  <div style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)' }}>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{ width: '100%', height: '240px', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}  
                    />
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.02) 100%)'
                    }}></div>
                    {product.stock < 10 && (
                      <span style={{
                        position: 'absolute',
                        top: '15px',
                        right: '15px',
                        backgroundColor: 'linear-gradient(45deg, #ff5722, #ff7043)',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '11px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: '0 4px 12px rgba(255, 87, 34, 0.3)'
                      }}>
                        Sắp hết
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '25px' }}>
                    <h3 style={{ 
                      fontSize: '17px', 
                      fontWeight: '600', 
                      margin: '0 0 12px 0', 
                      color: '#2c3e50', 
                      lineHeight: '1.4',
                      height: '44px',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {product.name}
                    </h3>
                    <div style={{ marginBottom: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '24px', fontWeight: '700', color: '#e91e63' }}>
                          {product.price.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '16px', color: '#e91e63' }}>đ</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: product.stock > 20 ? '#4caf50' : product.stock > 10 ? '#ff9800' : '#f44336'
                        }}></div>
                        <span style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>
                          {product.stock > 20 ? 'Còn hàng' : product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      disabled={product.stock === 0}
                      style={{
                        width: '100%',
                        padding: '14px',
                        background: product.stock === 0 ? '#ccc' : 'linear-gradient(45deg, #e91e63, #ff6b9d)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '30px',
                        cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '15px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        transition: 'all 0.3s ease',
                        boxShadow: product.stock === 0 ? 'none' : '0 4px 15px rgba(233, 30, 99, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        if (product.stock > 0) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 8px 25px rgba(233, 30, 99, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (product.stock > 0) {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = '0 4px 15px rgba(233, 30, 99, 0.3)';
                        }
                      }}
                    >
                      {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}