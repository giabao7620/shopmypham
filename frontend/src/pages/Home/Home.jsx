import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import CartIcon from "../../components/CartIcon";
import { FaList } from "react-icons/fa";
import BASE_URL from "../../config/api";

import "./home.css";

export default function Home() {
  const { user, logout, viewProduct, navigateTo, navigateToAdmin, addToCart, viewSubcategoryProducts } = useApp();
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [menuTimeout, setMenuTimeout] = useState(null);
  const [hoveredSubcategories, setHoveredSubcategories] = useState({});
  const [subcategoryProductCounts, setSubcategoryProductCounts] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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
      const response = await fetch(`${BASE_URL}/products`);
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
      const response = await fetch(`${BASE_URL}/products/subcategory/${subcategoryId}`);
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

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const filtered = allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const fetchHoveredSubcategories = async (categoryId) => {
    console.log('fetchHoveredSubcategories called with categoryId:', categoryId);
    console.log('Current hoveredSubcategories:', hoveredSubcategories);

    try {
      console.log('Fetching from API:', `${BASE_URL}/subcategories/category/${categoryId}`);
      const response = await fetch(`${BASE_URL}/subcategories/category/${categoryId}`);
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
            alignItems: 'center',
            height: '70px',
            gap: '30px'
          }}>
            {/* Logo */}
            <div onClick={() => navigateTo('home')} style={{ cursor: 'pointer', flexShrink: 0 }}>
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

            {/* Thanh tìm kiếm */}
            <div style={{ position: 'relative', flex: 1, maxWidth: '500px', margin: '0 auto' }}>
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                style={{
                  width: '100%',
                  padding: '12px 45px 12px 20px',
                  border: '2px solid #f0f0f0',
                  borderRadius: '25px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s',
                  backgroundColor: '#ffe6f2'
                }}
                // onFocus={(e) => e.target.style.borderColor = '#e91e63'}
                onBlur={(e) => setTimeout(() => e.target.style.borderColor = '#f0f0f0', 200)}
              />
              <button
                onClick={handleSearch}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'pink',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px'
                }}>
                🔍
              </button>

              {/* Dropdown kết quả tìm kiếm */}
              {searchResults.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  border: '1px solid #e9ecef',
                  borderRadius: '15px',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                  marginTop: '5px',
                  overflow: 'hidden'
                }}>
                  {searchResults.slice(0, 4).map(product => (
                    <div
                      key={product._id}
                      onClick={() => {
                        viewProduct(product._id);
                        setSearchTerm('');
                        setSearchResults([]);
                      }}
                      style={{
                        padding: '12px 15px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f0f0f0'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>{product.name}</div>
                        <div style={{ fontSize: '13px', color: '#e91e63', fontWeight: 'bold' }}>{product.price?.toLocaleString()}đ</div>
                      </div>
                    </div>
                  ))}
                  <div 
                    onClick={() => {
                      // Tạo trang kết quả tìm kiếm hoặc chuyển đến trang tất cả sản phẩm
                      navigateTo('allProducts');
                      setSearchTerm('');
                      setSearchResults([]);
                    }}
                    style={{
                      padding: '12px 15px',
                      textAlign: 'center',
                      backgroundColor: '#f8f9fa',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#e91e63',
                      borderTop: '1px solid #f0f0f0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#e91e63';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#f8f9fa';
                      e.target.style.color = '#e91e63';
                    }}
                  >
                    Xem tất cả {searchResults.length} kết quả »
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {user ? (
                <>
                  <CartIcon />
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    Xin chào, {user.name} {user.role === 'admin' && '(Admin)'}
                  </span>
                  {user.role === 'admin' && (
                    <button
                      onClick={navigateToAdmin}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#ff9800',
                        color: 'white',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Quản trị
                    </button>
                  )}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
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

      {/* Top sản phẩm bán chạy */}
      <section style={{ padding: '60px 20px', backgroundColor: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h3 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#333',
              margin: '0 0 15px 0'
            }}>
               Top Sản Phẩm Bán Chạy
            </h3>
            <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
              Những sản phẩm được yêu thích nhất
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '30px'
          }}>
            {allProducts.slice(4, 7).map((product, index) => (
              <div key={product._id} style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 30px rgba(233, 30, 99, 0.1)',
                transition: 'all 0.3s',
                cursor: 'pointer',
                border: '2px solid transparent',
                position: 'relative'
              }}
                onClick={() => viewProduct(product._id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(233, 30, 99, 0.2)';
                  e.currentTarget.style.borderColor = '#e91e63';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(233, 30, 99, 0.1)';
                  e.currentTarget.style.borderColor = 'transparent';
                }}>
                {/* Badge thứ hạng */}
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  left: '15px',
                  backgroundColor: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32',
                  color: 'white',
                  padding: '8px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  zIndex: 1
                }}>
                  #{index + 1}
                </div>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                />
                <div style={{ padding: '25px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 12px 0', color: '#333', lineHeight: '1.4' }}>
                    {product.name}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#e91e63', margin: 0 }}>
                      {product.price.toLocaleString()}đ
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span style={{ color: '#ffd700', fontSize: '14px' }}>★★★★★</span>
                      <span style={{ fontSize: '12px', color: '#999' }}>(4.8)</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#4caf50'
                    }}></div>
                    <span style={{ fontSize: '13px', color: '#4caf50', fontWeight: '500' }}>
                      Bán chạy nhất tuần
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'linear-gradient(45deg, #e91e63, #ff6b9d)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 20px rgba(233, 30, 99, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
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
            <button style={{ background: 'none', border: 'none', color: 'white', textDecoration: 'none', opacity: 0.8, cursor: 'pointer' }}>Về chúng tôi</button>
            <button style={{ background: 'none', border: 'none', color: 'white', textDecoration: 'none', opacity: 0.8, cursor: 'pointer' }}>Liên hệ</button>
            <button style={{ background: 'none', border: 'none', color: 'white', textDecoration: 'none', opacity: 0.8, cursor: 'pointer' }}>Chính sách</button>
            <button style={{ background: 'none', border: 'none', color: 'white', textDecoration: 'none', opacity: 0.8, cursor: 'pointer' }}>Hỗ trợ</button>
          </div>
          <p style={{ fontSize: '14px', opacity: 0.6, margin: 0 }}>
            © 2024 BeautyStore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}