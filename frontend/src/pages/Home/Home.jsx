import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import CartIcon from "../../components/CartIcon";
import { FaList } from "react-icons/fa";

import "./home.css";

export default function Home() {
  const { user, logout, viewProduct, navigateTo, addToCart, viewCategoryProducts, viewSubcategoryProducts } = useApp();
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [menuTimeout, setMenuTimeout] = useState(null);
  const [hoveredSubcategories, setHoveredSubcategories] = useState({});
  const [subcategoryProductCounts, setSubcategoryProductCounts] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9icr06OWIB8OMh1fSx_iAAyOpJeh9Ac1Epw&s",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNff291IUkUe4o8MN1v2-Zinbb8ORVJgYFcQ&s"
  ];

  // Dữ liệu tĩnh cho 2 danh mục chính
  const categories = [
    { name: 'Dưỡng da', _id: '68f729316cd4fea1d98e5bd9' },
    { name: 'Trang điểm', _id: '2' }
  ];

  useEffect(() => {
    fetchAllProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const fetchAllProducts = async () => {
    try {
      const response = await fetch('http://localhost:8888/products');
      if (response.ok) {
        const data = await response.json();
        setAllProducts(data);
      }
    } catch (error) {
      console.error('Error fetching all products:', error);
    }
  };



  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes('dưỡng') || name.includes('da')) return '🌸';
    if (name.includes('trang điểm')) return '💄';
    return '📁';
  };

  const fetchProductCount = async (subcategoryId) => {
    try {
      const response = await fetch(`http://localhost:8888/products/subcategory/${subcategoryId}`);
      if (response.ok) {
        const products = await response.json();
        return products.length;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching product count:', error);
      return 0;
    }
  };

  const fetchHoveredSubcategories = async (categoryId) => {
    console.log('fetchHoveredSubcategories called with categoryId:', categoryId);
    console.log('Current hoveredSubcategories:', hoveredSubcategories);

    try {
      console.log('Fetching from API:', `http://localhost:8888/subcategories/category/${categoryId}`);
      const response = await fetch(`http://localhost:8888/subcategories/category/${categoryId}`);
      console.log('API Response status:', response.status);

      if (!response.ok) {
        console.error(`API Error: ${response.status}`);
        setHoveredSubcategories(prev => ({ ...prev, [categoryId]: [] }));
        return;
      }

      const data = await response.json();
      console.log('API Response data:', data);
      console.log('Is data array?', Array.isArray(data));
      console.log('Data length:', Array.isArray(data) ? data.length : 'Not array');

      const processedData = Array.isArray(data) ? data : [];
      console.log('Processed data:', processedData);

      setHoveredSubcategories(prev => {
        const newState = { ...prev, [categoryId]: processedData };
        console.log('Setting new hoveredSubcategories state:', newState);
        return newState;
      });

      // Fetch product counts for each subcategory
      for (const subcategory of processedData) {
        const count = await fetchProductCount(subcategory._id);
        setSubcategoryProductCounts(prev => ({
          ...prev,
          [subcategory._id]: count
        }));
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      console.error('Error details:', error.message);
      setHoveredSubcategories(prev => ({ ...prev, [categoryId]: [] }));
    }
  };



  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
              <div onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
                <h1 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '32px',
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
                <p style={{ color: '#555', letterSpacing: '2px', fontSize: '10px', margin: '2px 0 0 0', textAlign: 'center' }}>COSMETICS</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {user ? (
                <>
                  <CartIcon />
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    Xin chào, {user.name} {user.role === 'admin' && '(Admin)'}
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

      {/* Categories Menu Bar */}
      <section style={{
        background: 'linear-gradient(#e91e63)',
        padding: '15px 0',
        boxShadow: '0 2px 10px rgba(233, 30, 99, 0.2)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            gap: '20px',
          }}>

            <div
              style={{
                padding: '12px 25px',
                color: 'white',
                fontSize: '16px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer'
              }}
              onMouseEnter={() => {
                if (menuTimeout) {
                  clearTimeout(menuTimeout);
                  setMenuTimeout(null);
                }
                setShowCategoryMenu(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => {
                  setShowCategoryMenu(false);
                  setHoveredCategory(null);
                }, 300);
                setMenuTimeout(timeout);
              }}
            >
              <FaList />

              Danh mục sản phẩm
            </div>

            <div style={{
              padding: '12px 25px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer'
            }}>
              ✨ Sản phẩm mới
            </div>



            {showCategoryMenu && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  backgroundColor: 'white',
                  minWidth: '280px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  borderRadius: '15px',
                  zIndex: 1000,
                  marginTop: '8px',
                  border: '1px solid #e9ecef',
                  overflow: 'hidden'
                }}
                onMouseEnter={() => {
                  if (menuTimeout) {
                    clearTimeout(menuTimeout);
                    setMenuTimeout(null);
                  }
                }}
                onMouseLeave={() => {
                  const timeout = setTimeout(() => {
                    setShowCategoryMenu(false);
                    setHoveredCategory(null);
                  }, 200);
                  setMenuTimeout(timeout);
                }}
              >
                {categories.map((category, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      borderBottom: index < categories.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}
                    onMouseEnter={() => {
                      console.log('Mouse entered category:', category.name, 'with ID:', category._id);
                      setHoveredCategory(index);
                      fetchHoveredSubcategories(category._id);
                      if (menuTimeout) {
                        clearTimeout(menuTimeout);
                        setMenuTimeout(null);
                      }
                    }}
                  >
                    <div style={{
                      padding: '15px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      backgroundColor: hoveredCategory === index ? '#f8f9fa' : 'white',
                      transition: 'background-color 0.2s'
                    }}>
                      <span style={{ fontSize: '20px' }}>{getCategoryIcon(category.name)}</span>
                      <span style={{ fontSize: '15px', fontWeight: '500', color: '#333', flex: 1 }}>
                        {category.name}
                      </span>
                      <span style={{ fontSize: '12px', color: '#999' }}>▶</span>
                    </div>

                    {/* Submenu */}
                    {hoveredCategory === index && (
                      <div
                        style={{
                          position: 'fixed',
                          top: '120px',
                          left: '480px',
                          backgroundColor: 'white',
                          minWidth: '400px',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                          borderRadius: '12px',
                          border: '1px solid #e9ecef',
                          zIndex: 9999,
                          overflow: 'hidden',
                          padding: '10px'
                        }}
                        onMouseEnter={() => {
                          if (menuTimeout) {
                            clearTimeout(menuTimeout);
                            setMenuTimeout(null);
                          }
                        }}
                        onMouseLeave={() => {
                          const timeout = setTimeout(() => {
                            setHoveredCategory(null);
                          }, 150);
                          setMenuTimeout(timeout);
                        }}
                      >
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                          gap: '0'
                        }}>
                          {hoveredSubcategories[category._id] && Array.isArray(hoveredSubcategories[category._id]) && hoveredSubcategories[category._id].map((sub, subIndex) => (
                            <div
                              key={sub._id}
                              onClick={() => {
                                setShowCategoryMenu(false);
                                setHoveredCategory(null);
                                viewSubcategoryProducts(sub._id, sub.name);
                              }}
                              style={{
                                padding: '12px 16px',
                                fontSize: '14px',
                                color: '#555',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                borderRadius: '8px'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f8f9fa';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'white';
                              }}
                            >
                              <span style={{ fontSize: '12px', color: '#e91e63' }}>•</span>
                              {sub.name}
                              {subcategoryProductCounts[sub._id] !== undefined && (
                                <span style={{ fontSize: '12px', color: '#999', marginLeft: 'auto' }}>
                                  ({subcategoryProductCounts[sub._id]})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Hero Banner */}
      <section style={{
        backgroundColor: '#f8f9fa',
        padding: '60px 20px'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <img 
            src={heroImages[currentImageIndex]}
            alt="Beauty products"
            style={{ width: '100%', height: '400px', objectFit: 'cover', borderRadius: '15px' }}
          />
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            marginTop: '20px'
          }}>
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: currentImageIndex === index ? '#e91e63' : '#ccc',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: '60px 20px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
            <h3 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#333',
              margin: 0
            }}>
              Sản Phẩm
            </h3>
            <button
              onClick={() => navigateTo('allProducts')}
              style={{
                padding: '12px 24px',
                backgroundColor: '#e91e63',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#d81b60'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#e91e63'}
            >
              Xem tất cả
            </button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '25px'
          }}>
            {allProducts.slice(0, 4).map(product => (
              <div key={product._id} style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                border: '1px solid #f0f0f0'
              }}
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
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div style={{ padding: '20px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', margin: '0 0 10px 0', color: '#333', lineHeight: '1.4' }}>
                    {product.name}
                  </h4>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#e91e63', margin: '10px 0' }}>
                    {product.price.toLocaleString()}đ
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      backgroundColor: '#e91e63',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#d81b60'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#e91e63'}
                  >
                    Thêm vào giỏ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer style={{
        backgroundColor: '#2c3e50',
        color: 'white',
        padding: '50px 20px 30px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '24px',
              background: 'linear-gradient(90deg, #f8b500, #ff6f91, #a86ff0, #f8b500)',
              backgroundSize: '300% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              fontWeight: '600',
              margin: 0,
              animation: 'gradientMove 3s ease-in-out infinite'
            }}>BeautyStore</h3>
            <p style={{ color: '#bbb', letterSpacing: '1px', fontSize: '10px', margin: '5px 0 0 0' }}>COSMETICS</p>
          </div>
          <p style={{ fontSize: '16px', opacity: 0.8, marginBottom: '30px' }}>
            Nơi khám phá vẻ đẹp tự nhiên của bạn
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            marginBottom: '30px',
            flexWrap: 'wrap'
          }}>
            <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Về chúng tôi</a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Liên hệ</a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Chính sách</a>
            <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>Hỗ trợ</a>
          </div>
          <p style={{ fontSize: '14px', opacity: 0.6, margin: 0 }}>
            © 2024 BeautyStore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}