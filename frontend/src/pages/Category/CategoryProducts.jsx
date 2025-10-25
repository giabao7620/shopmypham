import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import CartIcon from '../../components/CartIcon';

export default function CategoryProducts() {
  const { selectedCategory, navigateTo, viewProduct, addToCart, user, logout } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryProducts();
    }
  }, [selectedCategory]);

  const fetchCategoryProducts = async () => {
    try {
      setLoading(true);
      console.log('Fetching products for category:', selectedCategory);
      console.log('Has subcategory:', !!selectedCategory.subcategory);
      
      // Lấy danh sách categories để tìm category_id
      const categoriesRes = await fetch('http://localhost:8888/categories');
      const categories = await categoriesRes.json();
      console.log('All categories:', categories);
      
      // Tìm category_id dựa trên tên
      const category = categories.find(cat => 
        cat.category_name.toLowerCase() === selectedCategory.categoryName.toLowerCase()
      );
      console.log('Found category:', category);
      
      if (category) {
        // Lấy sản phẩm theo category_id
        console.log('Fetching products for category ID:', category._id);
        const res = await fetch(`http://localhost:8888/products/category/${category._id}`);
        const categoryProducts = await res.json();
        console.log('Category products:', categoryProducts);
        setProducts(categoryProducts);
      } else {
        console.log('Category not found, filtering all products');
        // Nếu không tìm thấy category, lấy tất cả và filter theo tên
        const res = await fetch('http://localhost:8888/products');
        const allProducts = await res.json();
        
        const filtered = allProducts.filter(product => {
          const categoryName = selectedCategory.categoryName.toLowerCase();
          const productName = product.name.toLowerCase();
          
          // Nếu có subcategory, tìm theo subcategory
          if (selectedCategory.subcategory) {
            const subcategory = selectedCategory.subcategory.toLowerCase();
            return productName.includes(subcategory.split(' ')[0]) || 
                   productName.includes(categoryName.split(' ')[0]);
          }
          
          return productName.includes(categoryName.split(' ')[0]);
        });
        console.log('Filtered products:', filtered);
        setProducts(filtered);
      }
    } catch (error) {
      console.error('Lỗi khi lấy sản phẩm theo danh mục:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedCategory) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Không tìm thấy danh mục</h2>
        <button onClick={() => navigateTo('home')}>Về trang chủ</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '70px'
          }}>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {user ? (
                <>
                  <CartIcon />
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    Xin chào, {user.name}
                  </span>
                  <button
                    onClick={logout}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#e91e63',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigateTo("register")}
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
                    Đăng ký
                  </button>
                  <button
                    onClick={() => navigateTo("login")}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#e91e63',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    Đăng nhập
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e9ecef' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '15px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#666' }}>
            <span 
              onClick={() => navigateTo('home')}
              style={{ cursor: 'pointer', color: '#e91e63' }}
            >
              Trang chủ
            </span>
            <span>›</span>
            <span>{selectedCategory.categoryName}</span>
            {selectedCategory.subcategory && (
              <>
                <span>›</span>
                <span style={{ color: '#333', fontWeight: '500' }}>{selectedCategory.subcategory}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <section style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '15px', margin: 0 }}>
            {selectedCategory.subcategory || selectedCategory.categoryName}
          </h2>
          <p style={{ fontSize: '18px', opacity: 0.9 }}>
            {selectedCategory.subcategory 
              ? `Khám phá bộ sưu tập ${selectedCategory.subcategory.toLowerCase()}`
              : `Tất cả sản phẩm ${selectedCategory.categoryName.toLowerCase()}`
            }
          </p>
        </div>
      </section>

      <section style={{ padding: '60px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px'
          }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>
              {loading ? 'Đang tải...' : products.length > 0 ? `Tìm thấy ${products.length} sản phẩm` : 'Không có sản phẩm'}
            </h3>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div style={{ fontSize: '18px', color: '#666' }}>Đang tải sản phẩm...</div>
            </div>
          ) : products.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '30px'
            }}>
              {products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => viewProduct(product._id)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    border: '1px solid #e9ecef',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
                  }}
                >
                  <div style={{
                    height: '250px',
                    backgroundColor: '#f8f9fa',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      />
                    ) : (
                      <div style={{ fontSize: '64px', color: '#dee2e6' }}>🧴</div>
                    )}
                  </div>

                  <div style={{ padding: '20px' }}>
                    <h4 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: '#333',
                      lineHeight: '1.4'
                    }}>
                      {product.name}
                    </h4>
                    <p style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#e91e63',
                      marginBottom: '15px'
                    }}>
                      {product.price?.toLocaleString()}đ
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, 1);
                      }}
                      style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#e91e63',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c2185b'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#e91e63'}
                    >
                      Thêm vào giỏ hàng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '80px 20px',
              backgroundColor: 'white',
              borderRadius: '15px',
              border: '1px solid #e9ecef'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔍</div>
              <h3 style={{ fontSize: '24px', color: '#333', marginBottom: '15px' }}>
                Không tìm thấy sản phẩm
              </h3>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px' }}>
                Hiện tại chưa có sản phẩm nào trong danh mục này.
              </p>
              <button
                onClick={() => navigateTo('home')}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#e91e63',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Về trang chủ
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}