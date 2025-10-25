import React, { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import axios from "axios";
import BASE_URL from "../../config/api";

// CSS cho animation
const modalStyles = `
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-50px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

// Thêm styles vào head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = modalStyles;
  document.head.appendChild(styleSheet);
}

export default function AdminDashboard() {
  const { navigateTo, user } = useApp();
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({ totalProducts: 0, totalUsers: 0 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/products`);
      setProducts(res.data);
      setStats(prev => ({ ...prev, totalProducts: res.data.length }));
    } catch (err) {
      console.error("Lỗi khi lấy sản phẩm:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users`);
      setStats(prev => ({ ...prev, totalUsers: res.data.length }));
    } catch (err) {
      console.error("Lỗi khi lấy người dùng:", err);
    }
  };

  const openDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await axios.delete(`${BASE_URL}/products/${productToDelete._id}`);
      fetchProducts();
      closeDeleteModal();
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        padding: '20px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ color: '#e91e63', margin: 0, fontSize: '28px' }}>🛠️ Trang Quản Trị</h1>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              <span style={{ color: '#666' }}>Xin chào, {user?.name}</span>
              <button
                onClick={() => navigateTo('home')}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e91e63',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🏠 Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div>
            <h3 style={{ color: '#e91e63', margin: '0 0 5px 0' }}>Tổng sản phẩm</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>{stats.totalProducts}</p>
          </div>
          
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>👥</div>
            <h3 style={{ color: '#e91e63', margin: '0 0 5px 0' }}>Người dùng</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>{stats.totalUsers}</p>
          </div>

          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>💰</div>
            <h3 style={{ color: '#e91e63', margin: '0 0 5px 0' }}>Doanh thu</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: 0 }}>-</p>
          </div>
        </div>

        {/* Products Management */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '25px', borderBottom: '1px solid #eee' }}>
            <h2 style={{ color: '#e91e63', margin: 0, fontSize: '22px' }}>📋 Quản lý sản phẩm</h2>
          </div>
          
          <div style={{ padding: '25px' }}>
            {products.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', fontSize: '16px' }}>Chưa có sản phẩm nào.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8bbd0' }}>
                      <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e91e63' }}>Hình ảnh</th>
                      <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e91e63' }}>Tên sản phẩm</th>
                      <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e91e63' }}>Giá</th>
                      <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #e91e63' }}>Tồn kho</th>
                      <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #e91e63' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.slice(0, 10).map((product) => (
                      <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '15px' }}>
                          {product.image ? (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                            />
                          ) : (
                            <div style={{ width: '50px', height: '50px', backgroundColor: '#f0f0f0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📷</div>
                          )}
                        </td>
                        <td style={{ padding: '15px', fontWeight: '500' }}>{product.name}</td>
                        <td style={{ padding: '15px', color: '#e91e63', fontWeight: 'bold' }}>{product.price?.toLocaleString()}đ</td>
                        <td style={{ padding: '15px' }}>{product.stock || 0}</td>
                        <td style={{ padding: '15px', textAlign: 'center' }}>
                          <button
                            onClick={() => openDeleteModal(product)}
                            style={{
                              padding: '8px 15px',
                              backgroundColor: '#f44336',
                              color: 'white',
                              border: 'none',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            🗑️ Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {products.length > 10 && (
                  <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
                    Hiển thị 10/{products.length} sản phẩm
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
            textAlign: 'center',
            animation: 'modalSlideIn 0.3s ease-out'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>⚠️</div>
            <h3 style={{ color: '#333', marginBottom: '15px', fontSize: '20px' }}>Xác nhận xóa sản phẩm</h3>
            <p style={{ color: '#666', marginBottom: '25px', lineHeight: '1.5' }}>
              Bạn có chắc chắn muốn xóa sản phẩm <br/>
              <strong style={{ color: '#e91e63' }}>"{ productToDelete?.name }"</strong>?
            </p>
            <p style={{ color: '#999', fontSize: '14px', marginBottom: '30px' }}>
              Hành động này không thể hoàn tác!
            </p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={closeDeleteModal}
                style={{
                  padding: '12px 25px',
                  backgroundColor: '#f5f5f5',
                  color: '#666',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '12px 25px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                🗑️ Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
